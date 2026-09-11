const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const RUTA_PROTO = path.join(__dirname, "../proto/pedidos.proto");
const def = protoLoader.loadSync(RUTA_PROTO, { keepCase: true });
const paquete = grpc.loadPackageDefinition(def).restaurante.pedidos;

const menu = new Map([
  ["P100", { id_plato: "P100", nombre: "Hamburguesa Clásica", categoria: "Comida Rápida", precio: 35.0, disponible: true, tiempo_preparacion_min: 15 }],
  ["P200", { id_plato: "P200", nombre: "Pizza Personal", precio: 45.0, disponible: true, categoria: "Comida" }]
]);

const pedidos = new Map();

// Precargar 500 pedidos para cumplir el requisito de volumen
for (let i = 1; i <= 500; i++) {
  pedidos.set(`ORD-${i}`, {
    id_pedido: `ORD-${i}`,
    mesa_o_cliente: `Mesa ${(i % 20) + 1}`,
    total: (i * 2.5) + 10.0,
    estado: (i % 4) + 1
  });
}
console.log(`Base de datos en memoria inicializada con ${pedidos.size} pedidos.`);

const servicio = {
  ObtenerPlato: (call, callback) => {
    const id = call.request.id_plato;
    if (!id) return callback({ code: grpc.status.INVALID_ARGUMENT, message: "El ID es obligatorio" });
    const plato = menu.get(id);
    if (!plato) return callback({ code: grpc.status.NOT_FOUND, message: "Plato no encontrado" });
    return callback(null, plato);
  },

  CrearPedido: (call, callback) => {
    const { id_pedido, mesa_o_cliente, items } = call.request;
    if (!id_pedido || !items || items.length === 0) {
      return callback({ code: grpc.status.INVALID_ARGUMENT, message: "Datos incompletos" });
    }
    if (pedidos.has(id_pedido)) {
      return callback({ code: grpc.status.ALREADY_EXISTS, message: "El pedido ya existe" });
    }
    pedidos.set(id_pedido, { id_pedido, mesa_o_cliente, total: 50.0, estado: 1 });
    return callback(null, { id_pedido, estado_inicial: 1, total_estimado: 50.0, mensaje: "Pedido creado" });
  },

  ActualizarEstado: (call, callback) => {
    const { id_pedido, nuevo_estado } = call.request;
    const p = pedidos.get(id_pedido);
    if (!p) return callback({ code: grpc.status.NOT_FOUND, message: "Pedido no encontrado" });
    p.estado = nuevo_estado;
    return callback(null, { exito: true, id_pedido, estado_actual: nuevo_estado });
  },

  CancelarPedido: (call, callback) => {
    const { id_pedido } = call.request;
    if (!pedidos.has(id_pedido)) return callback({ code: grpc.status.NOT_FOUND, message: "Pedido no encontrado" });
    pedidos.delete(id_pedido);
    return callback(null, { cancelado: true, mensaje: "Pedido cancelado" });
  },

  ListarPedidos: (call) => {
    let enviados = 0;
    for (const p of pedidos.values()) {
      call.write(p);
      enviados++;
    }
    console.log(`Servidor: Se transmitieron ${enviados} pedidos por el canal de stream.`);
    call.end();
  }
};

const servidor = new grpc.Server();
servidor.addService(paquete.PedidosService.service, servicio);
const PUERTO = process.env.GRPC_ADDR || "0.0.0.0:50052";

servidor.bindAsync(PUERTO, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) return console.error(err);
  console.log(`Servidor gRPC escuchando en el puerto ${port}`);
});