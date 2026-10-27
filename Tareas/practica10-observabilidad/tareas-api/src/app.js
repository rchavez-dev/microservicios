const express = require("express");
const { estadoDeTarea } = require("./tarea");
const { correlacion } = require("./correlacion");
const { avisar } = require("./clienteNotificaciones");
const { cliente, duracion } = require("./metricas");
const { trace } = require("@opentelemetry/api");

const app = express();

app.use(express.json());
app.use(correlacion);

const tareas = [];

// Middleware de recolección de métricas
app.use((req, res, next) => {
  const fin = duracion.startTimer();
  res.on("finish", () =>
    fin({
      metodo: req.method,
      ruta: req.route ? req.route.path : "sin_ruta",
      codigo: res.statusCode,
    })
  );
  next();
});

// Endpoint de Prometheus
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", cliente.register.contentType);
  res.end(await cliente.register.metrics());
});

app.post("/tareas", async (req, res) => {
  if (!req.body.titulo) {
    req.registro.error(
      { codigo: 400 },
      "titulo es obligatorio"
    );

    return res.status(400).json({
      error: "titulo es obligatorio"
    });
  }

  // --- Span manual de OpenTelemetry ---
  const tracer = trace.getTracer("tareas-api");
  const span = tracer.startSpan("validar_tarea");
  span.setAttribute("tarea.titulo", req.body.titulo);

  try {
    const tarea = {
      id: tareas.length + 1,
      ...req.body,
      completada: false
    };

    tareas.push(tarea);
    await avisar(req, tarea);

    req.registro.info(
      { tareaId: tarea.id },
      "tarea creada"
    );

    res.status(201).json(tarea);
  } catch (error) {
    span.recordException(error);
    req.registro.error({ err: error.message }, "error al procesar tarea");
    res.status(500).json({ error: "error interno" });
  } finally {
    span.end();
  }
});

app.get("/tareas", (req, res) => {
  req.registro.info(
    { cantidad: tareas.length },
    "lista de tareas consultada"
  );

  res.json(
    tareas.map((t) => ({
      ...t,
      estado: estadoDeTarea(t)
    }))
  );
});

app.get("/tareas/lenta", async (_req, res) => {
  await new Promise((r) => setTimeout(r, 1500));
  res.json({ mensaje: "respuesta lenta" });
});

app.get("/error", (_req, res) => {
  res.status(500).json({ error: "error interno provocado" });
});

app.get("/salud", (req, res) => {
  req.registro.info("servicio saludable");
  res.status(200).json({ estado: "ok" });
});

module.exports = app;