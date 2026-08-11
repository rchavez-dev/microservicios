const express = require('express');
const path = require('path');

const app = express();

// Configurar la carpeta 'public' como el directorio de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bienvenidos.html'));
});

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
