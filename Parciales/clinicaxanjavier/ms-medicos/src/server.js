'use strict';
const grpc=require('@grpc/grpc-js');
const protoLoader=require('@grpc/proto-loader');
const {Pool}=require('pg');
const path=require('path');
const db=new Pool({host:process.env.PG_HOST||'localhost',port:+(process.env.PG_PORT||5432),database:process.env.PG_DATABASE,user:process.env.PG_USER,password:process.env.PG_PASSWORD});
const def=protoLoader.loadSync(path.join(__dirname,'../proto/medicos.proto'),{keepCase:true,longs:String,enums:String,defaults:true,oneofs:true});
const Service=grpc.loadPackageDefinition(def).clinica.medicos.v1.ServicioMedicos;
const status=grpc.status;
const err=(code,message)=>Object.assign(new Error(message),{code});
function toHorario(r){return {id:r.id,medico_id:r.medico_id,fecha:r.fecha,hora:r.hora,disponible:r.disponible};}
async function ObtenerMedico(call,callback){
 try { const {rows}=await db.query('SELECT * FROM medicos WHERE id=$1',[call.request.id]); if(!rows.length)return callback(err(status.NOT_FOUND,'Medico no encontrado'));callback(null,rows[0]); }
 catch(e){console.error(e);callback(err(status.INTERNAL,'Error consultando medico'));}
}
async function ListarMedicos(call,callback){
 try {const filtro=(call.request.especialidad||'').trim();const {rows}=filtro?await db.query('SELECT * FROM medicos WHERE LOWER(especialidad)=LOWER($1) ORDER BY id',[filtro]):await db.query('SELECT * FROM medicos ORDER BY id'); callback(null,{medicos:rows});}
 catch(e){console.error(e);callback(err(status.INTERNAL,'Error listando medicos'));}
}
async function ListarHorariosDisponibles(call){
 try {const {rows}=await db.query("SELECT id,medico_id,to_char(fecha,'YYYY-MM-DD') fecha,to_char(hora,'HH24:MI') hora,disponible FROM horarios WHERE medico_id=$1 AND disponible=TRUE ORDER BY fecha,hora",[call.request.id]);for(const row of rows)call.write(toHorario(row)); call.end();}
 catch(e){console.error(e);call.destroy(err(status.INTERNAL,'Error listando horarios'));}
}
async function ReservarHorario(call,callback){
 try {const {rows}=await db.query("UPDATE horarios SET disponible=FALSE WHERE id=$1 AND disponible=TRUE RETURNING id,medico_id,to_char(fecha,'YYYY-MM-DD') fecha,to_char(hora,'HH24:MI') hora,disponible",[call.request.id]);
 if(rows.length) return callback(null,toHorario(rows[0]));
 const found=await db.query('SELECT id FROM horarios WHERE id=$1',[call.request.id]);
 return callback(err(found.rows.length?status.FAILED_PRECONDITION:status.NOT_FOUND,found.rows.length?'HORARIO_OCUPADO':'Horario no encontrado'));
 }catch(e){console.error(e);callback(err(status.INTERNAL,'Error reservando horario'));}
}
async function LiberarHorario(call,callback){
 try {const {rows}=await db.query("UPDATE horarios SET disponible=TRUE WHERE id=$1 RETURNING id,medico_id,to_char(fecha,'YYYY-MM-DD') fecha,to_char(hora,'HH24:MI') hora,disponible",[call.request.id]); if(!rows.length)return callback(err(status.NOT_FOUND,'Horario no encontrado')); callback(null,toHorario(rows[0]));}
 catch(e){console.error(e);callback(err(status.INTERNAL,'Error liberando horario'));}
}
const server=new grpc.Server();
server.addService(Service.service,{ObtenerMedico,ListarMedicos,ListarHorariosDisponibles,ReservarHorario,LiberarHorario});
server.bindAsync(`0.0.0.0:${process.env.GRPC_PORT||50051}`,grpc.ServerCredentials.createInsecure(),(error,port)=>{if(error){console.error(error);process.exit(1);}console.log(`gRPC medicos en ${port}`);});
