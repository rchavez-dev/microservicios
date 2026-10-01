require("dotenv").config();
const amqp = require("amqplib");

const URL = process.env.RABBITMQ_URL;
const EX = process.env.EXCHANGE || "clinica.eventos";

async function main() {
  const conexion = await amqp.connect(URL);
  const canal = await conexion.createChannel();

  await canal.assertExchange(EX, "topic", { durable: true });
  await canal.assertExchange("clinica.reintentos", "direct", {
    durable: true
  });

  // Ejercicio 3:
  // 1) patrón específico
  // 2) comodín de una palabra
  // 3) todo el dominio
  const enlaces = [
    ["clinica.notificaciones", "cita.agendada"],
    ["clinica.citas", "cita.*"],
    ["clinica.auditoria", "#"]
  ];

  for (const [cola, patron] of enlaces) {
    if (cola === "clinica.notificaciones") {
      await canal.assertQueue(cola, {
        durable: true,
        deadLetterExchange: "clinica.reintentos"
      });
    } else {
      await canal.assertQueue(cola, { durable: true });
    }

    await canal.bindQueue(cola, EX, patron);

    console.log("enlazada", cola, "con", patron);
  }

  // Ejercicio 5: circuito de reintento.
  await canal.assertQueue("clinica.reintento", {
    durable: true,
    messageTtl: 5000,
    deadLetterExchange: EX,
    deadLetterRoutingKey: "cita.agendada"
  });

  await canal.bindQueue(
    "clinica.reintento",
    "clinica.reintentos",
    "cita.agendada"
  );

  await canal.assertQueue("clinica.muertos", {
    durable: true
  });

  console.log("topologia creada");
  await canal.close();
  await conexion.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
