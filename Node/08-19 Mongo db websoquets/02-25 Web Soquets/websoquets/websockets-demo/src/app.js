const WebSocket = require('ws');
// Crear un servidor WebSocket en el puerto 8080
const server = new WebSocket.Server({ port: 8080 });
console.log("Servidor WebSocket escuchando en ws://localhost:8080");
server.on("connection", socket => {
    console.log("Cliente conectado");
    // Enviar un mensaje de bienvenida al cliente
    socket.send("Bienvenido al servidor WebSocket");
    // Escuchar mensajes del cliente
    socket.on("message", message => {
        console.log(`Mensaje recibido: ${message}`);
        // Reenviar el mensaje a todos los clientes conectados
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Mensaje de otro cliente: ${message}`);
            }
        });
    });
    // Detectar desconexión del cliente
    socket.on("close", () => {
        console.log("Cliente desconectado");
    });
});
