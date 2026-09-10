const http = require('http');

const usuarios = [
  { id: 1, nombre: "Maria Flores", email: "maria@usfx.bo" },
  { id: 2, nombre: "Juan Perez", email: "juan@usfx.bo" }
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/usuarios' || req.url === '/usuarios/') {
    res.writeHead(200);
    return res.end(JSON.stringify(usuarios));
  }

  const match = req.url.match(/^\/usuarios\/(\d+)$/);
  if (match) {
    const u = usuarios.find(x => x.id === parseInt(match[1]));
    if (u) {
      res.writeHead(200);
      return res.end(JSON.stringify(u));
    }
    res.writeHead(404);
    return res.end(JSON.stringify({ error: "Usuario no encontrado" }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Ruta inexistente" }));
});

server.listen(3000, () => {
  console.log("Servicio REST escuchando en http://localhost:3000");
});