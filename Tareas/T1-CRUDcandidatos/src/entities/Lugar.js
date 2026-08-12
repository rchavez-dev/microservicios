const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Lugar",
  tableName: "lugar",
  columns: {
    id: { type: Number, primary: true, generated: true },
    nombre: { type: String, length: 150 }
  },
  relations: {
    candidatos: {
      type: "one-to-many",
      target: "Candidato",
      inverseSide: "lugar"
    }
  }
});
