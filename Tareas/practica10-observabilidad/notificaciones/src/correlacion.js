const { randomUUID } = require("crypto");
const { registro } = require("./registro");
const { trace } = require("@opentelemetry/api");

function correlacion(req, res, next) {
  req.idCorrelacion =
    req.get("x-correlation-id") || randomUUID();

  res.set("x-correlation-id", req.idCorrelacion);

  // Obtener el traceId del span activo de OpenTelemetry
  const spanActivo = trace.getActiveSpan();
  const traceId = spanActivo ? spanActivo.spanContext().traceId : null;
  req.traceId = traceId;
  req.registro = registro.child({
    idCorrelacion: req.idCorrelacion,
    ruta: req.path,
    metodo: req.method
  });

  next();
}

module.exports = { correlacion };
