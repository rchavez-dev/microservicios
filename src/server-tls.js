require("dotenv").config();
const fs = require("fs");
const https = require("https");
const app = require("./app");

const opciones = {
  key: fs.readFileSync("certs/servidor.key"),
  cert: fs.readFileSync("certs/servidor.crt"),
};

const PORT = 3443;
https.createServer(opciones, app).listen(PORT, () => {
  console.log(`Servidor HTTPS escuchando en https://localhost:${PORT}`);
});
