const { DataSource } = require("typeorm");
const { Candidato, Cargo, Lugar } = require("./entities");

const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Candidato, Cargo, Lugar],
});

module.exports = AppDataSource;