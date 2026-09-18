const http = require('http');

const PLATOS = {
  101: { id: 101, nombre: 'Hamburguesa Doble con Queso', categoria: 'Comida', precio: 35.00 },
  102: { id: 102, nombre: 'Pizza Personal Especial', categoria: 'Comida', precio: 45.00 },
  103: { id: 103, nombre: 'Jugo Natural de Fruta', categoria: 'Bebidas', precio: 15.00 },
  104: { id: 104, nombre: 'Gaseosa 500ml', categoria: 'Bebidas', precio: 5.00 },
};

const server = http.createServer((req, res) => {
  const match = req.url.match(/^\/platos\/(\d+)$/);
  if (req.method === 'GET' && match) {
    const plato = PLATOS[match[1]];
    if (plato) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(plato));
    }
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Plato no encontrado' }));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Ruta no valida' }));
});

server.listen(3001, () => {
  console.log('Servicio REST de Catalogo escuchando en http://localhost:3001');
});