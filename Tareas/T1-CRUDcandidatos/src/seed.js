const AppDataSource = require("./data-source");

module.exports = async function seed() {
  const cargoRepo = AppDataSource.getRepository("Cargo");
  const lugarRepo = AppDataSource.getRepository("Lugar");

  if (await cargoRepo.count() === 0) {
    await cargoRepo.save([
      { nombre: "Rector" },
      { nombre: "Vicerrector" },
      { nombre: "Decano" },
      { nombre: "Vicedecano" },
      { nombre: "Director de Carrera" },
      { nombre: "Jefe de Departamento" },
      { nombre: "Representante Docente" },
      { nombre: "Representante Estudiantil" }
    ]);
  }

  if (await lugarRepo.count() === 0) {
    await lugarRepo.save([
      { nombre: "Facultad de Ciencias Jurídicas, Políticas y Sociales" },
      { nombre: "Facultad de Ciencias Económicas, Administrativas y Financieras" },
      { nombre: "Facultad de Ingeniería" },
      { nombre: "Facultad de Ciencias de la Salud" },
      { nombre: "Facultad de Arquitectura y Ciencias del Hábitat" },
      { nombre: "Facultad de Humanidades" },
      { nombre: "Facultad de Tecnología" },
      { nombre: "Facultad de Ciencias Agrícolas" },
      { nombre: "Facultad de Medicina" },
      { nombre: "Facultad de Odontología" },
      { nombre: "Facultad de Ciencias Farmacéuticas y Bioquímicas" },
      { nombre: "Otra unidad académica - USFX Sucre" }
    ]);
  }
};
