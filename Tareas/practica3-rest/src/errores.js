function fallo(res, estado, codigo, mensaje, detalles = []) {
  return res.status(estado).json({
    error: {
      codigo,
      mensaje,
      detalles
    }
  });
}

module.exports = { fallo };