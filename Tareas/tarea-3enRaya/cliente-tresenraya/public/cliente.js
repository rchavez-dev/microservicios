const socket = new WebSocket('ws://localhost:8080');


let miJugador = null;


const jugadorTexto =
    document.getElementById('jugador');

const turnoTexto =
    document.getElementById('turno');

const mensaje =
    document.getElementById('mensaje');

const botones =
    document.querySelectorAll('#tablero button');

const botonReiniciar =
    document.getElementById('reiniciar');


// Cuando se conecta
socket.onopen = function () {

    console.log('Conectado al servidor WebSocket');

};


// Cuando recibimos un mensaje
socket.onmessage = function (event) {

    const datos = JSON.parse(event.data);


    // El servidor nos dice si somos X u O
    if (datos.tipo === 'jugador') {

        miJugador = datos.jugador;


        jugadorTexto.textContent =
            `Eres el jugador ${miJugador}`;

    }


    // Recibimos el estado del juego
    if (datos.tipo === 'estado') {

        actualizarTablero(datos);

    }


    // Recibimos un error
    if (datos.tipo === 'error') {

        mensaje.textContent =
            datos.mensaje;

    }

};


// Cuando se cierra la conexión
socket.onclose = function () {

    mensaje.textContent =
        'Desconectado del servidor.';

};


// Cuando hacemos clic en una casilla
botones.forEach(function (boton) {

    boton.addEventListener('click', function () {

        const posicion =
            Number(boton.dataset.posicion);


        socket.send(JSON.stringify({

            tipo: 'movimiento',

            posicion: posicion

        }));

    });

});


// Actualizar tablero
function actualizarTablero(datos) {


    datos.tablero.forEach(function (valor, posicion) {

        botones[posicion].textContent = valor;

    });


    // Todavía falta un jugador
    if (datos.jugadores < 2) {

        turnoTexto.textContent =
            'Esperando al segundo jugador...';

        return;

    }


    // Empate
    if (datos.ganador === 'EMPATE') {

        turnoTexto.textContent =
            '¡Empate!';

        return;

    }


    // Ganador
    if (datos.ganador !== null) {

        turnoTexto.textContent =
            `¡Ganó el jugador ${datos.ganador}!`;

        return;

    }


    // Turno normal
    turnoTexto.textContent =
        `Turno: ${datos.turno}`;

}


// Botón reiniciar
botonReiniciar.addEventListener('click', function () {

    socket.send(JSON.stringify({

        tipo: 'reiniciar'

    }));

});