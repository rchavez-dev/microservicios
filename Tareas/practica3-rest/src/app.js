const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { consultarPlato } = require("./pedidos.cliente");

const app = express();
app.use(express.json());

// Endpoint de salud (infraestructura)
app.get("/salud", (_req, res) => res.json({ estado: "arriba" }));

// Rutas versionadas
const { router } = require("./usuarios.rutas");
const { router: pedidosRouter } = require("./pedidos.rutas");

app.use("/v1/usuarios", router);
app.use("/v1/pedidos", pedidosRouter);
app.use("/usuarios", router);

// Documentación Swagger / OpenAPI
const doc = YAML.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc));

// Endpoint puente gRPC -> REST (debe ir antes del manejador 404)
app.get("/platos-grpc/:id", async (req, res) => {
  try {
    const plato = await consultarPlato(req.params.id);
    return res.json(plato);
  } catch (error) {
    if (error.code === 5) return res.status(404).json({ error: error.details });
    if (error.code === 3) return res.status(400).json({ error: error.details });
    if (error.code === 14) return res.status(503).json({ error: "Servicio de pedidos no disponible" });
    return res.status(500).json({ error: "Error interno" });
  }
});

// Manejador central para rutas no encontradas (404)
app.use((_req, res) => {
  res.status(404).json({
    error: {
      codigo: "RUTA_NO_ENCONTRADA",
      mensaje: "Ruta inexistente",
      detalles: []
    }
  });
});

// Manejador central de errores
app.use((err, _req, res, _next) => {
  const malJson = err.type === "entity.parse.failed";
  res.status(malJson ? 400 : 500).json({
    error: {
      codigo: malJson ? "JSON_INVALIDO" : "ERROR_INTERNO",
      mensaje: malJson ? "El cuerpo no es JSON válido" : "Error interno",
      detalles: []
    }
  });
});

module.exports = app;