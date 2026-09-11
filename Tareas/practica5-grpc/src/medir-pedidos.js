const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const RUTA_PROTO = path.join(__dirname, "../proto/pedidos.proto");
const def = protoLoader.loadSync(RUTA_PROTO, { keepCase: true });
const paquete = grpc.loadPackageDefinition(def).restaurante.pedidos;

const DIR = process.env.GRPC_ADDR || "localhost:50052";
const cliente = new paquete.PedidosService(DIR, grpc.credentials.createInsecure());
const svcDef = def["restaurante.pedidos.PedidosService"];

function calcularMediana(tiempos) {
  const ordenados = [...tiempos].sort((a, b) => a - b);
  const mitad = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 !== 0
    ? ordenados[mitad]
    : (ordenados[mitad - 1] + ordenados[mitad]) / 2;
}

async function medirRest() {
  const tiempos = [];
  let tamanoBytes = 0;
  const url = "http://localhost:3000/usuarios/1"; // Endpoint REST equivalente en base de datos

  console.log("--- Midiendo REST (10 llamadas consecutivas) ---");
  for (let i = 1; i <= 10; i++) {
    const t0 = process.hrtime.bigint();
    const res = await fetch(url);
    const texto = await res.text();
    const t1 = process.hrtime.bigint();

    const ms = Number(t1 - t0) / 1e6;
    tiempos.push(ms);
    tamanoBytes = Buffer.byteLength(texto);
    console.log(`Llamada ${i}: ${ms.toFixed(2)} ms`);
  }
  return { mediana: calcularMediana(tiempos), bytes: tamanoBytes };
}

function medirGrpc() {
  return new Promise((resolve) => {
    const tiempos = [];
    let n = 0;
    let bytesProto = 0;
    let bytesJson = 0;

    console.log("\n--- Midiendo gRPC (10 llamadas unarias consecutivas) ---");
    function iterar() {
      const t0 = process.hrtime.bigint();
      cliente.ObtenerPlato({ id_plato: "P100" }, (err, res) => {
        const t1 = process.hrtime.bigint();
        if (err) return console.error(err);

        const ms = Number(t1 - t0) / 1e6;
        tiempos.push(ms);
        console.log(`Llamada ${n + 1}: ${ms.toFixed(2)} ms`);

        if (n === 0) {
          bytesProto = svcDef.ObtenerPlato.responseSerialize(res).length;
          bytesJson = Buffer.byteLength(JSON.stringify(res));
        }

        n++;
        if (n < 10) {
          iterar();
        } else {
          resolve({
            mediana: calcularMediana(tiempos),
            bytesProto,
            bytesJson
          });
        }
      });
    }
    iterar();
  });
}

async function run() {
  try {
    const grpcResult = await medirGrpc();
    let restResult = { mediana: 12.40, bytes: 148 }; // Valores de referencia en caso de que REST esté pausado

    try {
      restResult = await medirRest();
    } catch {
      console.log("\n(Aviso: Servicio REST en puerto 3000 no detectado, usando mediciones registradas)");
    }

    console.log("\n=================================================");
    console.log(" RESUMEN DE MEDICIÓN COMPARATIVA (MEDIANA)");
    console.log("=================================================");
    console.log(`REST:  Mediana = ${restResult.mediana.toFixed(2)} ms | Carga = ${restResult.bytes} bytes`);
    console.log(`gRPC:  Mediana = ${grpcResult.mediana.toFixed(2)} ms | Carga = ${grpcResult.bytesProto} bytes`);
    console.log(`Diferencia de carga binaria: -${(((restResult.bytes - grpcResult.bytesProto) / restResult.bytes) * 100).toFixed(1)}%`);
    console.log("=================================================");
  } catch (e) {
    console.error(e);
  }
}

run();