require("dotenv").config();
const amqp = require("amqplib");

async function main() {
  const conexion = await amqp.connect(process.env.RABBITMQ_URL);
  const canal = await conexion.createChannel();

  const EX = process.env.EXCHANGE || "clinica.eventos";

  await canal.assertExchange(EX, "topic", { durable: true });

  // Cola transitoria para la contraprueba del Ejercicio 4.
  await canal.assertQueue("clinica.prueba.volatil", {
    durable: false
  });

  await canal.bindQueue(
    "clinica.prueba.volatil",
    EX,
    "cita.agendada"
  );

  const evento = {
    tipo: "CitaAgendada",
    id: "CITA-VOLATIL-001",
    pacienteId: 1,
    medicoId: 1,
    fecha: "2026-10-01",
    hora: "11:00",
    correo: "volatil@usfx.bo",
    estado: "AGENDADA"
  };

  canal.publish(
    EX,
    "cita.agendada",
    Buffer.from(JSON.stringify(evento)),
    {
      persistent: false,
      contentType: "application/json",
      messageId: evento.id
    }
  );

  console.log(
    "Mensaje NO persistente publicado en cola transitoria clinica.prueba.volatil"
  );

  setTimeout(async () => {
    await canal.close();
    await conexion.close();
  }, 500);
}

main().catch(console.error);
