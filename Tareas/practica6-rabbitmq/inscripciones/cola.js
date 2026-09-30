const amqp = require("amqplib");
let canal;
async function conectar() {
const conexion = await amqp.connect(process.env.RABBITMQ_URL);
canal = await conexion.createChannel();
const ex = process.env.EXCHANGE;
await canal.assertExchange(ex, "direct", { durable: true });
console.log("[inscripciones] conectado al broker");
process.on("SIGINT", async () => {
await canal.close(); await conexion.close(); process.exit(0);
});
}

function publicar(clave, evento) {
const cuerpo = Buffer.from(JSON.stringify(evento));
// persistent: true pide que el mensaje se escriba en disco
return canal.publish(process.env.EXCHANGE, clave, cuerpo, {
persistent: true,
        contentType: "application/json",
        messageId: evento.id,
    });
}
module.exports = { conectar, publicar };