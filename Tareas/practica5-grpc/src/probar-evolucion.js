const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const CARPETA = process.env.PROTO_DIR || path.join(__dirname, "../proto");
const RUTA = path.join(CARPETA, "pedidos.proto");

const def = protoLoader.loadSync(RUTA, { keepCase: true });
const paquete = grpc.loadPackageDefinition(def).restaurante.pedidos;

const DIR = process.env.GRPC_ADDR || "localhost:50052";
const cliente = new paquete.PedidosService(DIR, grpc.credentials.createInsecure());

console.log(`Cliente ejecutando con contrato desde: ${CARPETA}`);
cliente.ObtenerPlato({ id_plato: "P100" }, (err, plato) => {
  if (err) return console.error("Error:", err.message);
  console.log("Datos recibidos del plato:");
  console.log(JSON.stringify(plato, null, 2));
});