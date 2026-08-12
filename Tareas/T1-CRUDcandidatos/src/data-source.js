const { DataSource } = require("typeorm");
const Candidato = require("./entities/Candidato");
const Cargo = require("./entities/Cargo");
const Lugar = require("./entities/Lugar");

module.exports = new DataSource({
  type: "sqlite",
  database: "data/candidatos.sqlite",
  synchronize: true,
  logging: false,
  entities: [Candidato, Cargo, Lugar]
});
