'use strict';
const express = require('express');
const { graphql, buildSchema } = require('graphql');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
app.use(express.json());
const mongo = new MongoClient(process.env.MONGO_URL || 'mongodb://mongo:27017', { serverSelectionTimeoutMS: 3000 });
let citas;
const protoDef = protoLoader.loadSync(path.join(__dirname, '../proto/medicos.proto'), {keepCase:true,longs:String,enums:String,defaults:true,oneofs:true});
const Service = grpc.loadPackageDefinition(protoDef).clinica.medicos.v1.ServicioMedicos;
const medicos = new Service(process.env.MEDICOS_GRPC || 'ms-medicos:50051', grpc.credentials.createInsecure());
const TIMEOUT_MS = 3000;
function rpc(metodo, datos) {
  return new Promise((resolve,reject) => medicos[metodo](datos, {deadline:new Date(Date.now()+TIMEOUT_MS)}, (err,value) => err?reject(err):resolve(value)));
}
function horariosStream(medicoId) {
  return new Promise((resolve,reject) => {
    const rows = []; let done = false;
    const stream = medicos.ListarHorariosDisponibles({id:medicoId}, {deadline:new Date(Date.now()+TIMEOUT_MS)});
    stream.on('data', row => rows.push(row));
    stream.on('error', e => {if(!done){done=true;reject(e);}});
    stream.on('end', () => {if(!done){done=true;resolve(rows);}});
  });
}
async function obtenerPaciente(id) {
  const url = (process.env.PACIENTES_URL || 'http://ms-pacientes:3001/api/v1') + '/pacientes/' + id;
  const response = await fetch(url,{signal:AbortSignal.timeout(TIMEOUT_MS)});
  if(response.status===404) return null;
  if(!response.ok) throw new Error('No fue posible consultar ms-pacientes');
  return response.json();
}
function idPositivo(v) {
  const n = Number(v);
  if(!Number.isSafeInteger(n)||n<=0) throw new Error('ID_INVALIDO');
  return n;
}
function oid(v) {
  if(!/^[a-f0-9]{24}$/i.test(v||'')) throw new Error('CITA_NO_EXISTE');
  return new ObjectId(v);
}
function vista(doc) {
  if(!doc) return null;
  return {
    id:doc._id.toString(), pacienteId:doc.pacienteId, medicoId:doc.medicoId,
    horario:doc.horario, motivo:doc.motivo, estado:doc.estado, fechaCreacion:doc.fechaCreacion,
    paciente: async () => obtenerPaciente(doc.pacienteId),
    medico: async () => {try{return await rpc('ObtenerMedico',{id:doc.medicoId});}catch(e){if(e.code===grpc.status.NOT_FOUND)return null;throw e;}}
  };
}
const schema = buildSchema(`
 enum EstadoCita { PROGRAMADA CANCELADA }
 type Paciente { id: ID! ci: String! nombre: String! apellido: String! fecha_nacimiento: String! telefono: String seguro: String }
 type Medico { id: ID! nombre: String! especialidad: String! matricula: String! }
 type Horario { id: ID! medico_id: ID! fecha: String! hora: String! disponible: Boolean! }
 type Cita { id: ID! pacienteId: ID! medicoId: ID! horario: Horario! motivo: String! estado: EstadoCita! fechaCreacion: String! paciente: Paciente medico: Medico }
 input CitaInput { pacienteId: ID! medicoId: ID! horarioId: ID! motivo: String! }
 type Query { medicos(especialidad: String): [Medico!]! horariosDisponibles(medicoId: ID!): [Horario!]! citas(estado: EstadoCita): [Cita!]! cita(id: ID!): Cita citasDePaciente(pacienteId: ID!): [Cita!]! }
 type Mutation { agendarCita(input: CitaInput!): Cita! cancelarCita(id: ID!): Cita! }
`);
const root = {
  medicos: async ({especialidad}) => (await rpc('ListarMedicos',{especialidad:especialidad||''})).medicos,
  horariosDisponibles: async ({medicoId}) => horariosStream(idPositivo(medicoId)),
  citas: async ({estado}) => (await citas.find(estado?{estado}:{}).toArray()).map(vista),
  cita: async ({id}) => vista(await citas.findOne({_id:oid(id)})),
  citasDePaciente: async ({pacienteId}) => (await citas.find({pacienteId:idPositivo(pacienteId)}).toArray()).map(vista),
  agendarCita: async ({input}) => {
    const pacienteId=idPositivo(input.pacienteId);
    const medicoId=idPositivo(input.medicoId);
    const horarioId=idPositivo(input.horarioId);
    const motivo=String(input.motivo||'').trim();
    if(motivo.length<5) throw new Error('MOTIVO_DEMASIADO_CORTO');
    // Paso 1: validar paciente por REST.
    const paciente=await obtenerPaciente(pacienteId);
    if(!paciente) throw new Error('PACIENTE_NO_EXISTE');
    // Paso 2: obtener horarios del médico por streaming gRPC.
    const disponibles=await horariosStream(medicoId);
    if(!disponibles.some(h=>Number(h.id)===horarioId)) throw new Error('HORARIO_OCUPADO');
    // Paso 3: la condición WHERE disponible=TRUE de PostgreSQL evita doble reserva.
    let horario;
    try {horario=await rpc('ReservarHorario',{id:horarioId});}
    catch(e){if(e.code===grpc.status.FAILED_PRECONDITION||e.code===grpc.status.NOT_FOUND)throw new Error('HORARIO_OCUPADO');throw e;}
    // Paso 4: guardar; compensar con LiberarHorario si falla el INSERT.
    try {
      const doc={pacienteId,medicoId,horario,motivo,estado:'PROGRAMADA',fechaCreacion:new Date().toISOString()};
      const result=await citas.insertOne(doc);
      doc._id=result.insertedId;
      return vista(doc);
    } catch(e) {
      try {await rpc('LiberarHorario',{id:horarioId});}
      catch(rollbackError){console.error('ALERTA: liberación de compensación pendiente',horarioId,rollbackError);}
      throw new Error('NO_SE_PUDO_GUARDAR_CITA: '+e.message);
    }
  },
  cancelarCita: async ({id}) => {
    const _id=oid(id);
    // Evita cancelaciones dobles concurrentes.
    const anterior=await citas.findOneAndUpdate({_id,estado:'PROGRAMADA'},{$set:{estado:'CANCELANDO'}},{returnDocument:'before'});
    if(!anterior){
      const existente=await citas.findOne({_id});
      if(!existente)throw new Error('CITA_NO_EXISTE');
      if(existente.estado==='CANCELADA')throw new Error('CITA_YA_CANCELADA');
      throw new Error('CANCELACION_EN_PROCESO');
    }
    try{await rpc('LiberarHorario',{id:anterior.horario.id});}
    catch(e){await citas.updateOne({_id,estado:'CANCELANDO'},{$set:{estado:'PROGRAMADA'}});throw e;}
    try {
      await citas.updateOne({_id,estado:'CANCELANDO'},{$set:{estado:'CANCELADA'}});
      return vista(await citas.findOne({_id}));
    } catch(e){
      console.error('ALERTA: horario liberado, estado CANCELANDO requiere revisión',id,e);
      throw e;
    }
  }
};
app.get('/salud',async (_req,res)=>{
  try{await mongo.db().admin().ping();res.json({estado:'ok',servicio:'ms-citas'});}
  catch(_e){res.status(503).json({codigo:'BD_NO_DISPONIBLE',mensaje:'MongoDB no disponible'});}
});
app.post('/graphql',async(req,res)=>{
  const {query,variables,operationName}=req.body||{};
  if(typeof query!=='string')return res.status(400).json({errors:[{message:'Falta query GraphQL'}]});
  try{
    const result=await graphql({schema,source:query,rootValue:root,variableValues:variables,operationName});
    // GraphQL mantiene HTTP 200 para errores de ejecución en los resolvers.
    res.status(result.errors&&!result.data?400:200).json(result);
  }catch(e){console.error(e);res.status(500).json({errors:[{message:e.message}]});}
});
app.use((_req,res)=>res.status(404).json({codigo:'RUTA_NO_EXISTE',mensaje:'Ruta no encontrada'}));
async function start(){
  await mongo.connect();
  citas=mongo.db(process.env.MONGO_DATABASE||'clinica_citas').collection('citas');
  await citas.createIndex({'horario.id':1},{unique:true,partialFilterExpression:{estado:'PROGRAMADA'},name:'horario_programada_unico'});
  app.listen(+(process.env.PORT||4000),'0.0.0.0',()=>console.log('GraphQL citas en 4000'));
}
start().catch(e=>{console.error(e);process.exit(1);});
