const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    function generarOperacion() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const resultadoCorrecto = num1 + num2;

        ws.operacionActual = { num1, num2, resultadoCorrecto };

        ws.send(`¿Cuánto es ${num1} + ${num2}?`);
    }

    // Genera una operación al conectar el cliente
    generarOperacion();

    ws.on('message', function incoming(message) {
        const respuesta = parseInt(message);

        if (respuesta === ws.operacionActual.resultadoCorrecto) {
            ws.send("✅ Respuesta correcta. Generando nueva operación...");
        } else {
            ws.send("❌ Respuesta incorrecta. Intenta nuevamente.");
            return; // No genera otra operación hasta que acierte
        }

        // Genera una nueva operación solo después de responder correctamente
        setTimeout(generarOperacion, 2000);
    });
});
