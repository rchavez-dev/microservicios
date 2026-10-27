const pino = require("pino");
const path = require("path");

const servicio = process.env.SERVICIO || "notificaciones";

const archivo = path.resolve(
  __dirname,
  "../../registros",
  `${servicio}.log`
);

const destinos = pino.multistream([
  { stream: process.stdout },
  { stream: pino.destination(archivo) }
]);

const registro = pino(
  {
    level: process.env.NIVEL_LOG || "info",
    base: {
      servicio,
      entorno: process.env.ENTORNO || "laboratorio"
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (etiqueta) => ({ nivel: etiqueta })
    }
  },
  destinos
);

module.exports = { registro };
