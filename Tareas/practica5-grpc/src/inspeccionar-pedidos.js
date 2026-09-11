const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const RUTA_PROTO = path.join(__dirname, "../proto/pedidos.proto");

try {
  const def = protoLoader.loadSync(RUTA_PROTO, { keepCase: true });
  const paquete = grpc.loadPackageDefinition(def).restaurante.pedidos;

  console.log("==========================================");
  console.log(" CONTRATO PEDIDOS CARGADO CORRECTAMENTE");
  console.log("==========================================");
  console.log("Tipos y mensajes detectados:");
  console.log(Object.keys(def));

  console.log("\nOperaciones de PedidosService y sus rutas HTTP/2:");
  for (const [nombre, m] of Object.entries(paquete.PedidosService.service)) {
    console.log(" ", nombre, "->", m.path);
  }
  console.log("==========================================");
} catch (err) {
  console.error("Error al cargar el contrato:", err.message);
}