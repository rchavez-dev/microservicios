const { MongoClient, ObjectId } = require("mongodb");

let colUsuarios;
let colPedidos;

async function conectar() {
  const url = process.env.MONGO_URL || "mongodb://mongo:27017";
  const dbName = process.env.MONGO_DB || "restaurante";

  const cliente = await new MongoClient(url).connect();
  const db = cliente.db(dbName);

  colUsuarios = db.collection("usuarios");
  await colUsuarios.createIndex({ correo: 1 }, { unique: true });

  colPedidos = db.collection("pedidos");
  await colPedidos.createIndex({ codigo: 1 }, { unique: true });
  await colPedidos.createIndex({ estado: 1 }); // Índice para optimizar filtros

  return cliente;
}

const aId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

module.exports = {
  conectar,
  // Usuarios (Lab 0-6)
  crear: (u) => colUsuarios.insertOne(u),
  obtener: (id) => (aId(id) ? colUsuarios.findOne({ _id: aId(id) }) : null),
  borrar: (id) => (aId(id) ? colUsuarios.deleteOne({ _id: aId(id) }) : null),
  porCorreo: (correo) => colUsuarios.findOne({ correo }),
  listar: async (filtro = {}, orden = {}, pagina = 1, limite = 20) => {
    const skip = (pagina - 1) * limite;
    const datos = await colUsuarios.find(filtro).sort(orden).skip(skip).limit(limite).toArray();
    const total = await colUsuarios.countDocuments(filtro);
    return { datos, total };
  },

  // Pedidos (Parte 2)
  pedidos: {
    crear: (p) => colPedidos.insertOne(p),
    obtener: (id) => (aId(id) ? colPedidos.findOne({ _id: aId(id) }) : null),
    porCodigo: (codigo) => colPedidos.findOne({ codigo }),
    reemplazar: (id, p) => (aId(id) ? colPedidos.replaceOne({ _id: aId(id) }, p) : null),
    actualizar: (id, p) => (aId(id) ? colPedidos.updateOne({ _id: aId(id) }, { $set: p }) : null),
    borrar: (id) => (aId(id) ? colPedidos.deleteOne({ _id: aId(id) }) : null),
    listar: async (filtro = {}, orden = {}, pagina = 1, limite = 20) => {
      const skip = (pagina - 1) * limite;
      const datos = await colPedidos.find(filtro).sort(orden).skip(skip).limit(limite).toArray();
      const total = await colPedidos.countDocuments(filtro);
      return { datos, total };
    }
  }
};