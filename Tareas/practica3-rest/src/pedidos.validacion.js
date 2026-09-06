const ESTADOS_VALIDOS = ["PENDIENTE", "PAGADO", "ENVIADO", "CANCELADO"];

function validarPedido(cuerpo = {}, esParcial = false) {
  const d = [];
  const { codigo, clienteId, total, estado, items, fechaEntrega } = cuerpo;

  // Regla 1: Formato del código de pedido (ej. PED-1001)
  if (!esParcial || codigo !== undefined) {
    if (!codigo || !/^PED-\d{4,}$/.test(String(codigo))) {
      d.push({ campo: "codigo", problema: "Formato inválido. Debe iniciar con 'PED-' seguido de al menos 4 dígitos (ej: PED-1001)" });
    }
  }

  // Regla 2: Cliente obligatorio y longitud mínima
  if (!esParcial || clienteId !== undefined) {
    if (!clienteId || String(clienteId).trim().length < 3) {
      d.push({ campo: "clienteId", problema: "Obligatorio, mínimo 3 caracteres" });
    }
  }

  // Regla 3: Monto total positivo
  if (!esParcial || total !== undefined) {
    if (typeof total !== "number" || total <= 0) {
      d.push({ campo: "total", problema: "Debe ser un número mayor a 0" });
    }
  }

  // Regla 4: Estado dentro del ciclo de vida permitido
  if (!esParcial || estado !== undefined) {
    if (!ESTADOS_VALIDOS.includes(estado)) {
      d.push({ campo: "estado", problema: `Estado inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}` });
    }
  }

  // Regla 5: Lista de ítems no vacía
  if (!esParcial || items !== undefined) {
    if (!Array.isArray(items) || items.length === 0) {
      d.push({ campo: "items", problema: "Debe incluir al menos un ítem en el pedido" });
    }
  }

  // Regla 6: Coherencia temporal (fecha de entrega no puede ser pasada)
  if (fechaEntrega) {
    const fecha = new Date(fechaEntrega);
    if (isNaN(fecha.getTime()) || fecha < new Date()) {
      d.push({ campo: "fechaEntrega", problema: "Debe ser una fecha válida futura" });
    }
  }

  return d;
}

module.exports = { validarPedido };