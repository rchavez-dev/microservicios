const amqp = require("amqplib");

async function main() {
  const conexion = await amqp.connect(
    "amqp://admin:admin123@localhost:5672"
  );

  const canal = await conexion.createChannel();

  const evento = {
    tipo: "InscripcionConfirmada",
    id: "INS-DUPLICADO-001",
    estudiante: "Mario Perez",
    correo: "mario@usfx.bo",
    curso: "COM-600"
  };

  const cuerpo = Buffer.from(JSON.stringify(evento));

  const propiedades = {
    persistent: true,
    contentType: "application/json",
    messageId: evento.id
  };

  canal.publish(
    "inscripciones",
    "inscripcion.confirmada",
    cuerpo,
    propiedades
  );

  canal.publish(
    "inscripciones",
    "inscripcion.confirmada",
    cuerpo,
    propiedades
  );

  console.log("Mismo evento publicado dos veces:", evento.id);

  setTimeout(async () => {
    await canal.close();
    await conexion.close();
  }, 500);
}

main().catch(console.error);