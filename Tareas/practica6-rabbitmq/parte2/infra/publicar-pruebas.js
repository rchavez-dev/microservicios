require("dotenv").config();
const amqp = require("amqplib");

const claves = [
  "cita.agendada",
  "cita.cancelada",
  "pago.registrado",
  "paciente.actualizado",
  "medico.actualizado"
];

async function main() {
  const conexion = await amqp.connect(process.env.RABBITMQ_URL);
  const canal = await conexion.createChannel();

  for (let i = 0; i < claves.length; i++) {
    const routingKey = claves[i];

    canal.publish(
      process.env.EXCHANGE || "clinica.eventos",
      routingKey,
      Buffer.from(
        JSON.stringify({
          n: i + 1,
          routingKey
        })
      ),
      {
        persistent: true,
        contentType: "application/json",
        messageId: `PRUEBA-${i + 1}`
      }
    );

    console.log("publicado:", routingKey);
  }

  setTimeout(async () => {
    await canal.close();
    await conexion.close();
  }, 500);
}

main().catch(console.error);
