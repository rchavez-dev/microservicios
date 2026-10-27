function calcularTotal(items, descuentoPorcentaje) {
  const bruto = items.reduce(
    (a, i) => a + i.precio * i.cantidad,
    0
  );

  const descuentoValido = Math.min(
    Math.max(descuentoPorcentaje, 0),
    100
  );

  return bruto - (bruto * descuentoValido / 100);
}

module.exports = { calcularTotal };