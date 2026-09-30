'use strict';
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());
const pool = mysql.createPool({ host: process.env.MYSQL_HOST || 'localhost', port: +(process.env.MYSQL_PORT || 3306), user: process.env.MYSQL_USER, password: process.env.MYSQL_PASSWORD, database: process.env.MYSQL_DATABASE, connectionLimit: 10, dateStrings: true });
const fail = (res,status,codigo,mensaje) => res.status(status).json({codigo,mensaje});
const isDate = d => { if (!/^\d{4}-\d{2}-\d{2}$/.test(d || '')) return false; const t = new Date(d+'T00:00:00Z'); return !isNaN(t) && t.toISOString().slice(0,10) === d; };
const validate = p => {
  if (!p || typeof p.ci !== 'string' || !p.ci.trim() || !p.nombre || typeof p.nombre!=='string' || !p.apellido || typeof p.apellido!=='string' || !isDate(p.fecha_nacimiento) || typeof p.telefono!=='string' || !p.telefono.trim() || typeof p.seguro!=='string' || !p.seguro.trim()) return 'Faltan campos obligatorios o la fecha debe ser AAAA-MM-DD';
  if (p.ci.length > 30 || p.nombre.length > 100 || p.apellido.length > 100 || p.telefono.length > 30 || p.seguro.length > 100) return 'Un campo excede su longitud máxima';
  return null;
};
const wrap = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
app.get('/api/v1/salud', wrap(async (_req,res) => { await pool.query('SELECT 1'); res.json({estado:'ok',servicio:'ms-pacientes'}); }));
app.get('/api/v1/pacientes', wrap(async (req,res) => {
  const pagina = req.query.pagina === undefined ? 1 : Number(req.query.pagina);
  const tam = req.query.tam === undefined ? 10 : Number(req.query.tam);
  if (!Number.isInteger(pagina) || pagina < 1 || !Number.isInteger(tam) || tam < 1 || tam > 50) return fail(res,422,'DATOS_INVALIDOS','pagina debe ser >= 1 y tam entre 1 y 50');
  const offset=(pagina-1)*tam;
  const [[{total}]] = await pool.query('SELECT COUNT(*) total FROM pacientes');
  const [datos] = await pool.query('SELECT id,ci,nombre,apellido,fecha_nacimiento,telefono,seguro FROM pacientes ORDER BY id LIMIT ? OFFSET ?', [tam,offset]);
  res.json({pagina,tam,total,datos});
}));
app.get('/api/v1/pacientes/:id', wrap(async (req,res) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) return fail(res,422,'DATOS_INVALIDOS','ID inválido');
  const [[p]] = await pool.query('SELECT id,ci,nombre,apellido,fecha_nacimiento,telefono,seguro FROM pacientes WHERE id=?',[req.params.id]);
  if (!p) return fail(res,404,'PACIENTE_NO_EXISTE','Paciente no encontrado');
  res.json(p);
}));
app.post('/api/v1/pacientes', wrap(async (req,res) => {
  const error=validate(req.body); if(error) return fail(res,422,'DATOS_INVALIDOS',error);
  const {ci,nombre,apellido,fecha_nacimiento,telefono,seguro}=req.body;
  const [result]=await pool.query('INSERT INTO pacientes (ci,nombre,apellido,fecha_nacimiento,telefono,seguro) VALUES (?,?,?,?,?,?)',[ci.trim(),nombre.trim(),apellido.trim(),fecha_nacimiento,telefono.trim(),seguro.trim()]);
  const location=`/api/v1/pacientes/${result.insertId}`;
  res.status(201).location(location).json({id:result.insertId,ci,nombre,apellido,fecha_nacimiento,telefono,seguro});
}));
app.put('/api/v1/pacientes/:id', wrap(async (req,res) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) return fail(res,422,'DATOS_INVALIDOS','ID inválido');
  const error=validate(req.body); if(error) return fail(res,422,'DATOS_INVALIDOS',error);
  const {ci,nombre,apellido,fecha_nacimiento,telefono,seguro}=req.body;
  const [result]=await pool.query('UPDATE pacientes SET ci=?,nombre=?,apellido=?,fecha_nacimiento=?,telefono=?,seguro=? WHERE id=?',[ci.trim(),nombre.trim(),apellido.trim(),fecha_nacimiento,telefono.trim(),seguro.trim(),req.params.id]);
  if(!result.affectedRows) return fail(res,404,'PACIENTE_NO_EXISTE','Paciente no encontrado');
  res.json({id:Number(req.params.id),ci,nombre,apellido,fecha_nacimiento,telefono,seguro});
}));
app.delete('/api/v1/pacientes/:id', wrap(async (req,res) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) return fail(res,422,'DATOS_INVALIDOS','ID inválido');
  const [result]=await pool.query('DELETE FROM pacientes WHERE id=?',[req.params.id]);
  if(!result.affectedRows) return fail(res,404,'PACIENTE_NO_EXISTE','Paciente no encontrado');
  res.status(204).end();
}));
app.use((_req,res) => fail(res,404,'RUTA_NO_EXISTE','Ruta no encontrada'));
app.use((err,_req,res,_next) => {
  console.error(err);
  if (err.code==='ER_DUP_ENTRY') return fail(res,409,'CI_DUPLICADO','Ya existe un paciente con ese CI');
  if (err instanceof SyntaxError && 'body' in err) return fail(res,422,'DATOS_INVALIDOS','JSON inválido');
  fail(res,500,'ERROR_INTERNO','Error interno del servicio');
});
app.listen(Number(process.env.PORT||3001),'0.0.0.0',()=>console.log('REST pacientes en 3001'));
