const express = require('express');
const app = express();
const port = 3003;
// Configuramos EJS como motor de plantillas
app.set('views', './views');
app.set('view engine', 'ejs');
// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    console.log("entro")
    const productos = [
        { nombre: 'Manzana', precio: 1.5 },
        { nombre: 'Banana', precio: 0.8 },
        { nombre: 'Naranja', precio: 1.2 }
    ];

    res.render('index', { productos });
});
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});