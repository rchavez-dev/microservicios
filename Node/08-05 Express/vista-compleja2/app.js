const express = require('express');
const app = express();
const path = require('path');

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Datos dinámicos
const usuarios = [
    { id: 1, nombre: 'Juan', edad: 30 },
    { id: 2, nombre: 'Ana', edad: 25 },
];

// Ruta dinámica
app.get('/usuarios', (req, res) => {
    res.render('usuarios', { usuarios });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/');
});
