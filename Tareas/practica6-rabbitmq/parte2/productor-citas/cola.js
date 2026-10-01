const amqp = require("amqplib");

let conexion;
let canal;

async function conectar() {
  conexion = await amqp.connect(process.env.RABBITMQ_URL);
  canal = await conexion.createChannel();

  await canal.assertExchange(process.env.EXCHANGE, "topic", {
    durable: true
  });

  console.log("[productor-citas] conectado a RabbitMQ");
}

function publicarCitaAgendada(cita) {
  const evento = {
    tipo: "CitaAgendada",
    ...cita
  };

  const cuerpo = Buffer.from(JSON.stringify(evento));

  return canal.publish(
    process.env.EXCHANGE,
    process.env.CLAVE,
    cuerpo,
    {
      persistent: true,
      contentType: "application/json",
      messageId: cita.id
    }
  );
}

async function cerrar() {
  if (canal) await canal.close();
  if (conexion) await conexion.close();
}

module.exports = {
  conectar,
  publicarCitaAgendada,
  cerrar
};
