const amqp = require("amqplib");

const URL = "amqp://admin:admin123@localhost:5672";

async function main() {
  const conexion = await amqp.connect(URL);
  const canal = await conexion.createChannel();

  await canal.assertExchange("inscripciones", "direct", {
    durable: true
  });

  await canal.assertExchange("reintentos", "direct", {
    durable: true
  });

  // Cola principal.
  // Los mensajes rechazados pasan al exchange "reintentos".
  await canal.assertQueue("notificaciones.correo", {
    durable: true,
    deadLetterExchange: "reintentos"
  });

  await canal.bindQueue(
    "notificaciones.correo",
    "inscripciones",
    "inscripcion.confirmada"
  );

  // Cola de reintento.
  // Mantiene el mensaje 5 segundos y luego lo devuelve.
  await canal.assertQueue("notificaciones.reintento", {
    durable: true,
    messageTtl: 5000,
    deadLetterExchange: "inscripciones",
    deadLetterRoutingKey: "inscripcion.confirmada"
  });

  await canal.bindQueue(
    "notificaciones.reintento",
    "reintentos",
    "inscripcion.confirmada"
  );

  // Cola final de mensajes muertos.
  await canal.assertQueue("notificaciones.muertos", {
    durable: true
  });

  console.log("Topologia DLQ creada correctamente");

  await canal.close();
  await conexion.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});