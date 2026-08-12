const express = require("express");
const router = express.Router();
const AppDataSource = require("../data-source");

const candidatoRepo = () => AppDataSource.getRepository("Candidato");
const cargoRepo = () => AppDataSource.getRepository("Cargo");
const lugarRepo = () => AppDataSource.getRepository("Lugar");

async function catalogos() {
  return {
    cargos: await cargoRepo().find({ order: { nombre: "ASC" } }),
    lugares: await lugarRepo().find({ order: { nombre: "ASC" } })
  };
}

// READ - listado
router.get("/", async (req, res) => {
  try {
    const candidatos = await candidatoRepo().find({
      relations: ["cargo", "lugar"],
      order: { apellido1: "ASC", nombres: "ASC" }
    });

    res.render("candidatos/index", {
      title: "Candidatos - Elecciones USFX",
      candidatos,
      mensaje: req.query.mensaje
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      title: "Error",
      message: "No se pudieron cargar los candidatos."
    });
  }
});

// CREATE - formulario
router.get("/nuevo", async (req, res) => {
  const { cargos, lugares } = await catalogos();

  res.render("candidatos/form", {
    title: "Nuevo candidato",
    modo: "crear",
    candidato: {},
    cargos,
    lugares,
    error: null
  });
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { ci, nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;

    const { cargos, lugares } = await catalogos();

    if (!ci || !nombres || !apellido1 || !cargo_id || !lugar_id) {
      return res.status(400).render("candidatos/form", {
        title: "Nuevo candidato",
        modo: "crear",
        candidato: req.body,
        cargos,
        lugares,
        error: "Debe completar todos los campos obligatorios."
      });
    }

    const existe = await candidatoRepo().findOneBy({ ci: ci.trim() });

    if (existe) {
      return res.status(400).render("candidatos/form", {
        title: "Nuevo candidato",
        modo: "crear",
        candidato: req.body,
        cargos,
        lugares,
        error: "Ya existe un candidato registrado con ese CI."
      });
    }

    await candidatoRepo().save({
      ci: ci.trim(),
      nombres: nombres.trim(),
      apellido1: apellido1.trim(),
      apellido2: apellido2 ? apellido2.trim() : null,
      cargo_id: Number(cargo_id),
      lugar_id: Number(lugar_id)
    });

    res.redirect("/candidatos?mensaje=Candidato registrado correctamente.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el candidato.");
  }
});

// READ - detalle
router.get("/:ci", async (req, res) => {
  const candidato = await candidatoRepo().findOne({
    where: { ci: req.params.ci },
    relations: ["cargo", "lugar"]
  });

  if (!candidato) {
    return res.status(404).render("error", {
      title: "Candidato no encontrado",
      message: "No existe un candidato con el CI indicado."
    });
  }

  res.render("candidatos/detalle", {
    title: "Detalle del candidato",
    candidato
  });
});

// UPDATE - formulario
router.get("/:ci/editar", async (req, res) => {
  const candidato = await candidatoRepo().findOneBy({ ci: req.params.ci });

  if (!candidato) {
    return res.status(404).render("error", {
      title: "Candidato no encontrado",
      message: "No existe el candidato que desea editar."
    });
  }

  const { cargos, lugares } = await catalogos();

  res.render("candidatos/form", {
    title: "Editar candidato",
    modo: "editar",
    candidato,
    cargos,
    lugares,
    error: null
  });
});

// UPDATE
router.post("/:ci/editar", async (req, res) => {
  try {
    const { nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;

    await candidatoRepo().update(
      { ci: req.params.ci },
      {
        nombres: nombres.trim(),
        apellido1: apellido1.trim(),
        apellido2: apellido2 ? apellido2.trim() : null,
        cargo_id: Number(cargo_id),
        lugar_id: Number(lugar_id)
      }
    );

    res.redirect("/candidatos?mensaje=Candidato actualizado correctamente.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el candidato.");
  }
});

// DELETE
router.post("/:ci/eliminar", async (req, res) => {
  try {
    const resultado = await candidatoRepo().delete({ ci: req.params.ci });

    if (resultado.affected === 0) {
      return res.status(404).send("Candidato no encontrado.");
    }

    res.redirect("/candidatos?mensaje=Candidato eliminado correctamente.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el candidato.");
  }
});

module.exports = router;
