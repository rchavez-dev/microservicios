const express = require('express');
const app = express();

// Middleware para manejar datos en formato JSON
app.use(express.json());

// Rutas básicas
app.get('/', (req, res) => {
    res.send('<h2>Bienvenido a  Express</h2>');
});

app.post('/usuario', (req, res) => {
    const { nombre, edad } = req.body;
    res.send(`Usuario creado: ${nombre}, Edad: ${edad}`);
});
// Iniciar el servidor
const port = 3000;

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
