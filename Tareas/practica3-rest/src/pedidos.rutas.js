const { Router } = require("express");
const { validarPedido } = require("./pedidos.validacion");
const { fallo } = require("./errores");
const repo = require("./repositorio");

const router = Router();
const TOPE = 100;

// GET colección con paginación, filtros y orden (Ejercicio 4)
router.get("/", async (req, res) => {
  try {
    const pagina = Math.max(1, Number(req.query.pagina) || 1);
    const limite = Math.min(TOPE, Number(req.query.limite) || 20);

    const filtro = {};
    if (req.query.estado) filtro.estado = req.query.estado;
    if (req.query.totalMin) filtro.total = { $gte: Number(req.query.totalMin) };

    const orden = {
      [req.query.ordenPor || "total"]: req.query.orden === "desc" ? -1 : 1
    };

    const { datos, total } = await repo.pedidos.listar(filtro, orden, pagina, limite);

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
    console.error(err);
    return fallo(res, 500, "ERROR_INTERNO", "Error al listar pedidos");
  }
});

// POST crear pedido (201 Created + Location o 409 Conflicto)
router.post("/", async (req, res) => {
  const errores = validarPedido(req.body);
  if (errores.length > 0) {
    return fallo(res, 400, "VALIDACION", "Datos del pedido inválidos", errores);
  }

  const { codigo, clienteId, total, estado, items, fechaEntrega } = req.body;

  try {
    const existe = await repo.pedidos.porCodigo(codigo);
    if (existe) {
      return fallo(res, 409, "CONFLICTO", `El pedido con código '${codigo}' ya existe`);
    }

    const nuevo = {
      codigo,
      clienteId,
      total,
      estado,
      items,
      fechaEntrega: fechaEntrega || null,
      creadoEn: new Date()
    };

    const resultado = await repo.pedidos.crear(nuevo);
    return res
      .status(201)
      .location(`/v1/pedidos/${resultado.insertedId}`)
      .json({ id: resultado.insertedId, ...nuevo });
  } catch (err) {
    if (err.code === 11000) {
      return fallo(res, 409, "CONFLICTO", `El código de pedido ya está registrado`);
    }
    return fallo(res, 500, "ERROR_INTERNO", "No se pudo crear el pedido");
  }
});

// GET por ID (200 o 404)
router.get("/:id", async (req, res) => {
  const pedido = await repo.pedidos.obtener(req.params.id);
  if (!pedido) {
    return fallo(res, 404, "NO_ENCONTRADO", "Pedido no encontrado");
  }
  return res.json(pedido);
});

// PUT reemplazar completo (200 o 404)
router.put("/:id", async (req, res) => {
  const pedidoExistente = await repo.pedidos.obtener(req.params.id);
  if (!pedidoExistente) {
    return fallo(res, 404, "NO_ENCONTRADO", "Pedido no encontrado");
  }

  const errores = validarPedido(req.body);
  if (errores.length > 0) {
    return fallo(res, 400, "VALIDACION", "Datos del pedido inválidos", errores);
  }

  const { codigo, clienteId, total, estado, items, fechaEntrega } = req.body;
  const reemplazo = {
    codigo,
    clienteId,
    total,
    estado,
    items,
    fechaEntrega: fechaEntrega || null,
    actualizadoEn: new Date()
  };

  await repo.pedidos.reemplazar(req.params.id, reemplazo);
  return res.json({ id: req.params.id, ...reemplazo });
});

// DELETE eliminar / cancelar (204 No Content o 404)
router.delete("/:id", async (req, res) => {
  const resultado = await repo.pedidos.borrar(req.params.id);
  if (!resultado || resultado.deletedCount === 0) {
    return fallo(res, 404, "NO_ENCONTRADO", "Pedido no encontrado");
  }
  return res.status(204).end();
});
const { consultarPlato } = require("./pedidos.cliente");

// Ruta REST que consume internamente el microservicio gRPC
router.get("/platos-grpc/:id", async (req, res) => {
  try {
    const plato = await consultarPlato(req.params.id);
    return res.json(plato);
  } catch (error) {
    // Mapeo riguroso de códigos gRPC a estados HTTP
    if (error.code === 5) { // NOT_FOUND
      return res.status(404).json({ error: error.details });
    }
    if (error.code === 3) { // INVALID_ARGUMENT
      return res.status(400).json({ error: error.details });
    }
    if (error.code === 14) { // UNAVAILABLE
      return res.status(503).json({ error: "Microservicio gRPC de cocina no disponible" });
    }
    return res.status(500).json({ error: "Error interno en la pasarela REST" });
  }
});
module.exports = { router };