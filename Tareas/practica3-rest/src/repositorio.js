const { MongoClient, ObjectId } = require("mongodb");

let col;

async function conectar() {
  const cliente = await new MongoClient(process.env.MONGO_URL).connect();
  col = cliente.db(process.env.MONGO_DB).collection("usuarios");
  await col.createIndex({ correo: 1 }, { unique: true });
  return cliente;
}

const aId = (id) => (ObjectId.isValid(id) ? new ObjectId(id) : null);

module.exports = {
  conectar,
  crear: (u) => col.insertOne(u),
  obtener: (id) => (aId(id) ? col.findOne({ _id: aId(id) }) : null),
  borrar: (id) => (aId(id) ? col.deleteOne({ _id: aId(id) }) : null),
  porCorreo: (correo) => col.findOne({ correo }),
  listar: async (filtro = {}, orden = {}, pagina = 1, limite = 20) => {
    const skip = (pagina - 1) * limite;
    const datos = await col
      .find(filtro)
      .sort(orden)
      .skip(skip)
      .limit(limite)
      .toArray();
    const total = await col.countDocuments(filtro);
    return { datos, total };
  }
};