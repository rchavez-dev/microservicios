const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
app.use(express.json());

// Endpoint de salud (infraestructura)
app.get("/salud", (_req, res) => res.json({ estado: "arriba" }));

// Rutas versionadas
const { router } = require("./usuarios.rutas");
app.use("/v1/usuarios", router);

// Documentación Swagger / OpenAPI
const doc = YAML.load("./openapi.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc));

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