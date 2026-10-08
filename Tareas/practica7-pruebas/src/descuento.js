function calcularTotalConDescuento(total, descuento) {
  if (typeof total !== "number" || typeof descuento !== "number") {
    throw new Error("total y descuento deben ser números");
  }

  if (total < 0) {
    throw new Error("el total no puede ser negativo");
  }

  if (descuento < 0 || descuento > 100) {
    throw new Error("el descuento debe estar entre 0 y 100");
  }

  return total - (total * descuento / 100);
}

module.exports = { calcularTotalConDescuento };