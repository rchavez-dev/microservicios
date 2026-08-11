const express = require('express');
const app = express();
const port = 3000;
// Configuramos EJS como motor de plantillas
app.set('views', './views');
app.set('view engine', 'ejs');
// Middleware para parsear datos de formularios
app.use(express.urlencoded({ extended: false }));
// Ruta para mostrar el formulario
app.get('/', (req, res) => {
  res.render('index');
});

// Ruta para calcular la suma y mostrar el resultado
app.post('/calcular', (req, res) => {
  const num1 = parseInt(req.body.num1);
  const num2 = parseInt(req.body.num2);
  const suma = num1 + num2;
  res.render('resultado', { suma });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
