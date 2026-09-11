const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const RUTA_PROTO = path.join(__dirname, "../proto/pedidos.proto");
const def = protoLoader.loadSync(RUTA_PROTO, { keepCase: true });
const paquete = grpc.loadPackageDefinition(def).restaurante.pedidos;

const DIR = process.env.GRPC_ADDR || "localhost:50052";
const cliente = new paquete.PedidosService(DIR, grpc.credentials.createInsecure());

function ejecutarCaso(nombre, fn) {
  return new Promise((resolve) => {
    console.log(`\n--- Probando caso: ${nombre} ---`);
    fn((err, res) => {
      if (err) {
        console.log(`gRPC Status: ${err.code} (${grpc.status[err.code] || "DESCONOCIDO"})`);
        console.log(`Detalle: ${err.details}`);
      } else {
        console.log("gRPC Status: 0 (OK)");
        console.log("Respuesta:", JSON.stringify(res));
      }
      resolve();
    });
  });
}

async function run() {
  // 1. Caso Exitoso (OK - 0)
  await ejecutarCaso("1. Éxito al crear comanda", (cb) => {
    cliente.CrearPedido({
      id_pedido: "ORD-001",
      mesa_o_cliente: "Mesa 4",
      items: [{ id_plato: "P100", cantidad: 2, observaciones: "Sin cebolla" }]
    }, cb);
  });

  // 2. Caso INVALID_ARGUMENT (Code 3)
  await ejecutarCaso("2. Error de validación (argumento vacío)", (cb) => {
    cliente.ObtenerPlato({ id_plato: "" }, cb);
  });

  // 3. Caso ALREADY_EXISTS (Code 6)
  await ejecutarCaso("3. Error de duplicidad (comanda repetida)", (cb) => {
    cliente.CrearPedido({
      id_pedido: "ORD-001",
      mesa_o_cliente: "Mesa 4",
      items: [{ id_plato: "P100", cantidad: 1 }]
    }, cb);
  });

  // 4. Caso NOT_FOUND (Code 5)
  await ejecutarCaso("4. Error de no encontrado (plato inexistente)", (cb) => {
    cliente.ObtenerPlato({ id_plato: "P999_INEXISTENTE" }, cb);
  });
}

run();