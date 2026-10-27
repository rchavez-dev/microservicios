function procesarTareaCreada(evento) {
  if (
    typeof evento.id !== "number" ||
    typeof evento.titulo !== "string" ||
    typeof evento.creadaEn !== "string"
  ) {
    throw new Error("Evento TareaCreada inválido");
  }

  return `Notificación enviada para: ${evento.titulo}`;
}

module.exports = { procesarTareaCreada };