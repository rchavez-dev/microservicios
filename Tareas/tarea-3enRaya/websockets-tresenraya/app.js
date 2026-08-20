const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
  [0, 4, 8], [2, 4, 6]             // Diagonales
];

function checkWinner(board, player) {
  return winningCombinations.some(comb => comb.every(idx => board[idx] === player));
}

function isFull(board) {
  return board.every(cell => cell !== '');
}

wss.on('connection', (ws) => {
  console.log('Jugador conectado a la partida.');

  ws.on('message', (data) => {
    const { board } = JSON.parse(data);

    // 1. Verificar si el jugador (X) ganó con su movimiento
    if (checkWinner(board, 'X')) {
      return ws.send(JSON.stringify({ board, status: 'WIN_X', message: '¡Has ganado!' }));
    }

    if (isFull(board)) {
      return ws.send(JSON.stringify({ board, status: 'DRAW', message: '¡Empate!' }));
    }

    // 2. Respuesta del Servidor (O): Elige una casilla vacía al azar
    const emptyIndices = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    
    if (emptyIndices.length > 0) {
      const serverMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      board[serverMove] = 'O';

      // 3. Verificar si el servidor ganó con su jugada
      if (checkWinner(board, 'O')) {
        return ws.send(JSON.stringify({ board, status: 'WIN_O', message: '¡El Servidor ha ganado!' }));
      }

      if (isFull(board)) {
        return ws.send(JSON.stringify({ board, status: 'DRAW', message: '¡Empate!' }));
      }

      // El juego continúa
      ws.send(JSON.stringify({ board, status: 'PLAYING', message: 'Tu turno (X)' }));
    }
  });

  ws.on('close', () => console.log('Jugador desconectado.'));
});

console.log('Servidor WebSocket de Tres en Raya escuchando en ws://localhost:8080');