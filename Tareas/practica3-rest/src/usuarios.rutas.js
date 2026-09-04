const { Router } = require("express");
const { validarUsuario } = require("./usuarios.validacion");
const { fallo } = require("./errores");
const repo = require("./repositorio");

const router = Router();
const TOPE = 100;

// GET colección con paginación, filtrado y ordenamiento
router.get("/", async (req, res) => {
  try {
    const pagina = Math.max(1, Number(req.query.pagina) || 1);
    const limite = Math.min(TOPE, Number(req.query.limite) || 20);

    const filtro = {};
    if (req.query.edadMin) {
      filtro.edad = { $gte: Number(req.query.edadMin) };
    }

    const orden = {
      [req.query.ordenPor || "nombre"]: req.query.orden === "desc" ? -1 : 1
    };

    const { datos, total } = await repo.listar(filtro, orden, pagina, limite);

    return res.json({
      datos,
      paginacion: {
        pagina,
        limite,
        total,
        paginas: Math.ceil(total / limite)
      }
    });
  } catch (err) {
    console.error("Error al listar usuarios:", err);
    return fallo(res, 500, "ERROR_INTERNO", "Error interno al obtener usuarios");
  }
});

// POST crear usuario
router.post("/", async (req, res) => {
  const errores = validarUsuario(req.body);
  if (errores.length > 0) {
    return fallo(res, 400, "VALIDACION", "La solicitud tiene campos inválidos", errores);
  }

  const { nombre, correo, edad } = req.body;

  try {
    const repetido = await repo.porCorreo(correo);
    if (repetido) {
      return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
    }

    const resultado = await repo.crear({ nombre, correo, edad });
    const nuevoUsuario = { id: resultado.insertedId, nombre, correo, edad };
    return res.status(201).location(`/usuarios/${resultado.insertedId}`).json(nuevoUsuario);
  } catch (err) {
    if (err.code === 11000) {
      return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
    }
    return fallo(res, 500, "ERROR_INTERNO", "Error interno al crear usuario");
  }
});

// GET por ID
router.get("/:id", async (req, res) => {
  const usuario = await repo.obtener(req.params.id);
  if (!usuario) {
    return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
  }
  return res.json(usuario);
});

// DELETE por ID
router.delete("/:id", async (req, res) => {
  const resultado = await repo.borrar(req.params.id);
  if (!resultado || resultado.deletedCount === 0) {
    return fallo(res, 404, "NO_ENCONTRADO", "Usuario no encontrado");
  }
  return res.status(204).end();
});

module.exports = { router };