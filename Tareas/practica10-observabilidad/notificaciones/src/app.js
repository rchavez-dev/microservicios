const express = require("express");
const { correlacion } = require("./correlacion");
const { cliente, duracion } = require("./metricas");

const app = express();

app.use(express.json());
app.use(correlacion);

app.use((req, res, next) => {
  const fin = duracion.startTimer();
  res.on("finish", () => fin({
    metodo: req.method,
    ruta: req.route ? req.route.path : "sin_ruta",
    codigo: res.statusCode,
  }));
  next();
});

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", cliente.register.contentType);
  res.end(await cliente.register.metrics());
});

app.get("/salud", (req, res) => {
  req.registro.info("servicio saludable");

  res.status(200).json({
    estado: "ok",
    servicio: "notificaciones"
  });
});

app.post("/avisos", (req, res) => {
  const { tarea } = req.body;

  if (!tarea) {
    req.registro.error(
      { codigo: 400 },
      "tarea es obligatoria"
    );

    return res.status(400).json({
      error: "tarea es obligatoria"
    });
  }

  req.registro.info(
    { tareaId: tarea.id },
    "aviso recibido"
  );

  res.status(200).json({
    mensaje: "aviso recibido"
  });
});

module.exports = app;
