const { EntitySchema } = require("typeorm");

// Entidad Lugar
const Lugar = new EntitySchema({
  name: "Lugar",
  tableName: "lugar",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nombre: { type: "varchar" }
  }
});

// Entidad Cargo
const Cargo = new EntitySchema({
  name: "Cargo",
  tableName: "cargos",
  columns: {
    id: { primary: true, type: "int", generated: true },
    nombre: { type: "varchar" }
  }
});

// Entidad Candidato con sus relaciones
const Candidato = new EntitySchema({
  name: "Candidato",
  tableName: "candidatos",
  columns: {
    ci: { primary: true, type: "varchar", length: 12 },
    nombres: { type: "varchar", length: 60 },
    apellido1: { type: "varchar", length: 30 },
    apellido2: { type: "varchar", length: 40, nullable: true }
  },
  relations: {
    cargo: {
      type: "many-to-one",
      target: "Cargo",
      joinColumn: { name: "cargo_id" },
      eager: true
    },
    lugar: {
      type: "many-to-one",
      target: "Lugar",
      joinColumn: { name: "lugar_id" },
      eager: true
    }
  }
});

module.exports = { Candidato, Cargo, Lugar };