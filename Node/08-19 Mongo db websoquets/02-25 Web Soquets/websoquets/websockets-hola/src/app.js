const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log(' Cliente conectado.');

    // Escucha los mensajes del cliente
    ws.on('message', (message) => {
        console.log(` Cliente envió: ${message}`);

        // Responde solo a ese cliente
        ws.send(`Hola Mundo, ${message}!`);
    });

    ws.on('close', () => {
        console.log(' Cliente desconectado.');
    });
});

console.log(' Servidor WebSocket corriendo en ws://localhost:8080');
