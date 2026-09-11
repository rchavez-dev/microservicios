const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const RUTA_PROTO = path.join(__dirname, "../proto/pedidos.proto");
const def = protoLoader.loadSync(RUTA_PROTO, { keepCase: true });
const paquete = grpc.loadPackageDefinition(def).restaurante.pedidos;

const DIR = process.env.GRPC_ADDR || "localhost:50052";
const cliente = new paquete.PedidosService(DIR, grpc.credentials.createInsecure());

console.log("Iniciando solicitud de flujo de 500 pedidos...");
const tInicio = process.hrtime.bigint();
let primerElemento = null;
let ultimoElemento = null;
let contador = 0;

const stream = cliente.ListarPedidos({ estado_filtro: "" });

stream.on("data", (pedido) => {
  contador++;
  const ahora = process.hrtime.bigint();
  const ms = Number(ahora - tInicio) / 1e6;

  if (contador === 1) {
    primerElemento = { pedido, ms: ms.toFixed(2) };
    console.log(`[PRIMER ELEMENTO] Llegó en: ${primerElemento.ms} ms -> ID: ${pedido.id_pedido}, Mesa: ${pedido.mesa_o_cliente}`);
  }

  ultimoElemento = { pedido, ms: ms.toFixed(2) };
});

stream.on("end", () => {
  console.log(`[ÚLTIMO ELEMENTO] Llegó en: ${ultimoElemento.ms} ms -> ID: ${ultimoElemento.pedido.id_pedido}`);
  console.log("=================================================");
  console.log(`Flujo finalizado. Total de elementos recibidos: ${contador}`);
  console.log(`Tiempo hasta el primer dato utilizable: ${primerElemento.ms} ms`);
  console.log(`Tiempo hasta completar la descarga total: ${ultimoElemento.ms} ms`);
  console.log("=================================================");
});

stream.on("error", (err) => {
  console.error("Error en el stream:", err.code, err.details);
});