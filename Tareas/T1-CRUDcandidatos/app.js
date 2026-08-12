const express = require("express");
const path = require("path");
const AppDataSource = require("./data-source");
const candidatosRoutes = require("./routes/candidatos");
const { Cargo, Lugar } = require("./entities");

const app = express();

// Configurar motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para procesar datos de formularios HTML
app.use(express.urlencoded({ extended: true }));

// Inicializar la base de datos y arrancar el servidor
AppDataSource.initialize()
  .then(async () => {
    console.log("Base de datos SQLite conectada correctamente.");

    // Cargar opciones por defecto en Cargos y Lugar si las tablas están vacías
    const cargoRepo = AppDataSource.getRepository(Cargo);
    const lugarRepo = AppDataSource.getRepository(Lugar);

    if ((await cargoRepo.count()) === 0) {
      await cargoRepo.save([
        { nombre: "Presidente" },
        { nombre: "Uninominal" },
        { nombre: "Senador" }
      ]);
      console.log("Cargos iniciales insertados.");
    }

    if ((await lugarRepo.count()) === 0) {
      await lugarRepo.save([
        { nombre: "Circunscripción 1" },
        { nombre: "Circunscripción 2" },
        { nombre: "Circunscripción 3" }
      ]);
      console.log("Lugares iniciales insertados.");
    }

    // Registrar las rutas del CRUD
    app.use("/", candidatosRoutes);

    // Iniciar servidor en el puerto 3000
    app.listen(3000, () => {
      console.log("Servidor ejecutándose en http://localhost:3000");
    });
  })
  .catch((error) => console.error("Error al conectar la base de datos:", error));