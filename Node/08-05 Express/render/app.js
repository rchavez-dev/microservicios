const express = require('express');
const app = express();
const port = 3002;
// Configuramos EJS como motor de plantillas
app.set('views', './views');
app.set('view engine', 'ejs');
// Middleware para parsear datos de formularios


app.get('/', (req, res) => {
  res.render('mipagina');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
