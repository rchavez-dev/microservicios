const express = require("express");
const { validarCredenciales } = require("./usuarios");
const { autenticar, exigirRol, emitirToken } = require("./auth");

const app = express();
app.use(express.json());

let tareas = [
  { id: 1, titulo: "Tarea inicial de ejemplo", completada: false }
];

// Ruta publica: comprobacion de salud del servicio
app.get("/salud", (_req, res) => res.json({ estado: "activo", fecha: new Date() }));

// Ruta publica: inicio de sesion (emite JWT validando bcrypt)
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username y password requeridos" });
  }
  const usuario = await validarCredenciales(username, password);
  if (!usuario) {
    return res.status(401).json({ error: "credenciales invalidas" });
  }
  const token = emitirToken(usuario);
  res.json({ token, expiraEn: "15m", usuario });
});

// Rutas protegidas: lectura para consulta, operador y admin
app.get("/tareas", autenticar, exigirRol("consulta", "operador", "admin"), (_req, res) => {
  res.json(tareas);
});

// Rutas protegidas de escritura: operador y admin
app.post("/tareas", autenticar, exigirRol("operador", "admin"), (req, res) => {
  const { titulo } = req.body || {};
  if (!titulo) return res.status(400).json({ error: "el titulo es obligatorio" });
  const nueva = { id: tareas.length + 1, titulo, completada: false };
  tareas.push(nueva);
  res.status(201).json(nueva);
});

// Ruta protegida de eliminacion: solo admin
app.delete("/tareas/:id", autenticar, exigirRol("admin"), (req, res) => {
  const i = tareas.findIndex(t => t.id === Number(req.params.id));
  if (i < 0) return res.status(404).json({ error: "tarea no encontrada" });
  tareas.splice(i, 1);
  res.status(204).end();
});

module.exports = app;
