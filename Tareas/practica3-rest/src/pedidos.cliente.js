const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Ruta al contrato dentro de practica3-rest
const RUTA = path.join(__dirname, "../proto/pedidos.proto");
const def = protoLoader.loadSync(RUTA, { keepCase: true });
const paquete = grpc.loadPackageDefinition(def).restaurante.pedidos;

// Usa la variable de entorno para resolver por red de Docker (o localhost en pruebas locales)
const DIR = process.env.GRPC_PEDIDOS_ADDR || "localhost:50052";
const cliente = new paquete.PedidosService(DIR, grpc.credentials.createInsecure());

function consultarPlato(id_plato) {
  return new Promise((resolve, reject) => {
    cliente.ObtenerPlato({ id_plato }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

module.exports = { consultarPlato };