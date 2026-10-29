const express = require("express");
const { autenticar, exigirRol } = require("./auth");

const app = express();
app.use(express.json());

const tareas = [{ id: 1, titulo: "Preparar el laboratorio", completada: false }];

app.use("/tareas", autenticar);

app.get("/tareas", (_req, res) => res.json(tareas));

app.post("/tareas", (req, res) => {
  const tarea = { id: tareas.length + 1, ...req.body, completada: false };
  tareas.push(tarea);
  res.status(201).json(tarea);
});

app.delete("/tareas/:id", exigirRol("admin"), (req, res) => {
  const i = tareas.findIndex((t) => t.id === Number(req.params.id));
  if (i < 0) return res.status(404).json({ error: "no existe" });
  tareas.splice(i, 1);
  res.status(204).end();
});

module.exports = app;
