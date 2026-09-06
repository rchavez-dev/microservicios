require("dotenv").config();
const { MongoClient } = require("mongodb");

(async () => {
  const c = await new MongoClient(process.env.MONGO_URL).connect();
  const col = c.db(process.env.MONGO_DB).collection("pedidos");

  await col.deleteMany({});

  const estados = ["PENDIENTE", "PAGADO", "ENVIADO", "CANCELADO"];
  const lote = Array.from({ length: 10000 }, (_, i) => ({
    codigo: "PED-" + (1000 + i),
    clienteId: "CLI-" + (i % 500),
    total: Math.round((20 + (i % 800) * 1.5) * 100) / 100,
    estado: estados[i % estados.length],
    items: [
      { producto: "Articulo A", cantidad: 1, precio: 50 }
    ],
    creadoEn: new Date()
  }));

  await col.insertMany(lote);
  console.log("Pedidos sembrados con éxito. Total:", await col.countDocuments());
  await c.close();
})();