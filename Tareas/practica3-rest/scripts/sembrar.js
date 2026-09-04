require("dotenv").config();
const { MongoClient } = require("mongodb");

(async () => {
  const c = await new MongoClient(process.env.MONGO_URL).connect();
  const col = c.db(process.env.MONGO_DB).collection("usuarios");

  // Eliminamos usuarios sembrados anteriormente si existieran
  await col.deleteMany({ correo: { $regex: /@usfx\.bo$/ } });

  const lote = Array.from({ length: 10000 }, (_, i) => ({
    nombre: "Usuario " + i,
    correo: "usuario" + i + "@usfx.bo",
    edad: 18 + (i % 45),
  }));

  await col.insertMany(lote);
  console.log("documentos:", await col.countDocuments());
  await c.close();
})();