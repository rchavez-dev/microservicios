require("dotenv").config();

const amqp = require("amqplib");
const fs = require("fs");
const path = require("path");

const COLA = process.env.COLA || "clinica.notificaciones";
const LIMITE = Number(process.env.LIMITE_REINTENTOS || 3);
const TIEMPO = Number(process.env.TIEMPO_PROCESO_MS || 1500);
const IDEMPOTENCIA = (process.env.IDEMPOTENCIA || "true") === "true";
const NO_ACK = (process.env.NO_ACK || "false") === "true";
const ARCHIVO = path.resolve(
  process.env.ARCHIVO_PROCESADOS || "./procesados.json"
);

function leerProcesados() {
  if (!fs.existsSync(ARCHIVO)) return new Set();

  try {
    const datos = JSON.parse(fs.readFileSync(ARCHIVO, "utf8"));
    return new Set(Array.isArray(datos) ? datos : []);
  } catch {
    return new Set();
  }
}

function guardarProcesados(procesados) {
  fs.writeFileSync(
    ARCHIVO,
    JSON.stringify([...procesados], null, 2)
  );
}

const procesados = leerProcesados();
const cupos = { "COM-600": 30 };

async function procesar(evento) {
  if (!evento.correo || !evento.correo.includes("@")) {
    throw new Error("correo invalido: " + evento.correo);
  }

  console.log(
    "[notificaciones] procesando cita",
    evento.id,
    "para",
    evento.correo
  );

  await new Promise((r) => setTimeout(r, TIEMPO));

  cupos["COM-600"] = cupos["COM-600"] - 1;
  console.log("[cupos] COM-600 quedan", cupos["COM-600"]);

  console.log(
    "[notificaciones] correo de cita enviado a",
    evento.correo
  );
}

async function main() {
  const conexion = await amqp.connect(process.env.RABBITMQ_URL);
  const canal = await conexion.createChannel();

  await canal.assertQueue(COLA, {
    durable: true,
    deadLetterExchange: "clinica.reintentos"
  });

  canal.prefetch(1);

  console.log("[notificaciones] esperando mensajes en", COLA);
  console.log("[config] idempotencia =", IDEMPOTENCIA, "| noAck =", NO_ACK);

  canal.consume(
    COLA,
    async (mensaje) => {
      if (mensaje === null) return;

      const id = mensaje.properties.messageId;
      const muertes = mensaje.properties.headers["x-death"];
      const intentos = muertes ? Number(muertes[0].count) : 0;

      if (IDEMPOTENCIA && id && procesados.has(id)) {
        console.log(
          "[idempotencia] evento repetido",
          id,
          "- se ignora"
        );
        if (!NO_ACK) canal.ack(mensaje);
        return;
      }

      if (intentos >= LIMITE) {
        console.error(
          "[DLQ] sin mas intentos:",
          id,
          "-> clinica.muertos"
        );

        canal.sendToQueue(
          "clinica.muertos",
          mensaje.content,
          {
            persistent: true,
            contentType:
              mensaje.properties.contentType || "application/json",
            messageId: id
          }
        );

        if (!NO_ACK) canal.ack(mensaje);
        return;
      }

      try {
        const evento = JSON.parse(mensaje.content.toString());

        await procesar(evento);

        if (IDEMPOTENCIA && id) {
          procesados.add(id);
          guardarProcesados(procesados);
        }

        if (!NO_ACK) canal.ack(mensaje);
      } catch (e) {
        console.error(
          "[reintento] intento",
          intentos + 1,
          "fallido:",
          e.message
        );

        if (!NO_ACK) {
          canal.nack(mensaje, false, false);
        }
      }
    },
    { noAck: NO_ACK }
  );
}

main().catch((e) => {
  console.error("[notificaciones] error:", e.message);
  process.exit(1);
});
