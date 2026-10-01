require("dotenv").config();
const amqp = require("amqplib");

async function main() {
  const conexion = await amqp.connect(process.env.RABBITMQ_URL);
  const canal = await conexion.createChannel();

  const evento = {
    tipo: "CitaAgendada",
    id: "CITA-DUPLICADA-001",
    pacienteId: 1,
    medicoId: 1,
    fecha: "2026-10-01",
    hora: "10:00",
    motivo: "Prueba de idempotencia",
    correo: "paciente@usfx.bo",
    estado: "AGENDADA"
  };

  const cuerpo = Buffer.from(JSON.stringify(evento));
  const props = {
    persistent: true,
    contentType: "application/json",
    messageId: evento.id
  };

  canal.publish(
    process.env.EXCHANGE || "clinica.eventos",
    "cita.agendada",
    cuerpo,
    props
  );

  canal.publish(
    process.env.EXCHANGE || "clinica.eventos",
    "cita.agendada",
    cuerpo,
    props
  );

  console.log("evento duplicado publicado:", evento.id);

  setTimeout(async () => {
    await canal.close();
    await conexion.close();
  }, 500);
}

main().catch(console.error);
