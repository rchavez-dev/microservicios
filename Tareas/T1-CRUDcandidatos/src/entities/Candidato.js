const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Candidato",
  tableName: "candidatos",
  columns: {
    ci: { type: String, length: 12, primary: true },
    nombres: { type: String, length: 60 },
    apellido1: { type: String, length: 30 },
    apellido2: { type: String, length: 40, nullable: true },
    cargo_id: { type: Number },
    lugar_id: { type: Number }
  },
  relations: {
    cargo: {
      type: "many-to-one",
      target: "Cargo",
      joinColumn: { name: "cargo_id", referencedColumnName: "id" },
      onDelete: "RESTRICT"
    },
    lugar: {
      type: "many-to-one",
      target: "Lugar",
      joinColumn: { name: "lugar_id", referencedColumnName: "id" },
      onDelete: "RESTRICT"
    }
  }
});
