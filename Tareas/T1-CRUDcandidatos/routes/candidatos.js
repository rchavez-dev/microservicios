const express = require("express");
const router = express.Router();
const AppDataSource = require("../data-source");
const { Candidato, Cargo, Lugar } = require("../entities");

const candidatoRepo = AppDataSource.getRepository(Candidato);
const cargoRepo = AppDataSource.getRepository(Cargo);
const lugarRepo = AppDataSource.getRepository(Lugar);

// 1. Mostrar la lista de candidatos
router.get("/", async (req, res) => {
  try {
    const candidatos = await candidatoRepo.find();
    res.render("index", { candidatos });
  } catch (error) {
    res.status(500).send("Error al obtener candidatos: " + error.message);
  }
});

// 2. Mostrar formulario para registrar candidato
router.get("/nuevo", async (req, res) => {
  try {
    const cargos = await cargoRepo.find();
    const lugares = await lugarRepo.find();
    res.render("nuevo", { cargos, lugares });
  } catch (error) {
    res.status(500).send("Error al cargar datos: " + error.message);
  }
});

// 3. Guardar el nuevo candidato
router.post("/nuevo", async (req, res) => {
  try {
    const { ci, nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;
    const nuevo = candidatoRepo.create({
      ci,
      nombres,
      apellido1,
      apellido2,
      cargo: { id: parseInt(cargo_id) },
      lugar: { id: parseInt(lugar_id) }
    });
    await candidatoRepo.save(nuevo);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error al guardar candidato: " + error.message);
  }
});

// 4. Mostrar formulario para editar candidato
router.get("/editar/:ci", async (req, res) => {
  try {
    const candidato = await candidatoRepo.findOneBy({ ci: req.params.ci });
    const cargos = await cargoRepo.find();
    const lugares = await lugarRepo.find();
    res.render("editar", { candidato, cargos, lugares });
  } catch (error) {
    res.status(500).send("Error al obtener candidato: " + error.message);
  }
});

// 5. Actualizar los datos del candidato
router.post("/editar/:ci", async (req, res) => {
  try {
    const { nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;
    await candidatoRepo.save({
      ci: req.params.ci,
      nombres,
      apellido1,
      apellido2,
      cargo: { id: parseInt(cargo_id) },
      lugar: { id: parseInt(lugar_id) }
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error al actualizar candidato: " + error.message);
  }
});

// 6. Eliminar candidato
router.post("/eliminar/:ci", async (req, res) => {
  try {
    await candidatoRepo.delete(req.params.ci);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error al eliminar candidato: " + error.message);
  }
});

module.exports = router;