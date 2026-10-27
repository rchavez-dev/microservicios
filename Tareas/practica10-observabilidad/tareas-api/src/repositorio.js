const { MongoClient } = require("mongodb");

async function crearRepositorio(uri) {
  const cliente = await new MongoClient(uri).connect();
  const col = cliente.db("practica7").collection("tareas");

  return {
    guardar: (t) => col.insertOne(t),

    buscarPorTitulo: (titulo) =>
      col.findOne({ titulo }),

    contar: () =>
      col.countDocuments(),

    actualizarEstado: (titulo, completada) =>
      col.updateOne(
        { titulo },
        { $set: { completada } }
      ),

    eliminarPorTitulo: (titulo) =>
      col.deleteOne({ titulo }),

    limpiar: () =>
      col.deleteMany({}),

    cerrar: () =>
      cliente.close()
  };
}

module.exports = { crearRepositorio };