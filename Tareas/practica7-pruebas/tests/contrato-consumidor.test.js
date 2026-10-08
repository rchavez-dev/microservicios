const contrato = require("../contratos/tarea-creada.contrato.json");
const { procesarTareaCreada } = require("../src/notificaciones");

test("el consumidor procesa correctamente un evento que cumple el contrato", () => {
  const evento = {
    id: 1,
    titulo: "Estudiar",
    creadaEn: new Date().toISOString()
  };

  for (const campo of contrato.camposObligatorios) {
    expect(evento).toHaveProperty(campo);
    expect(typeof evento[campo]).toBe(contrato.tipos[campo]);
  }

  const resultado = procesarTareaCreada(evento);

  expect(resultado).toBe("Notificación enviada para: Estudiar");
});
test("el consumidor rechaza un evento inválido", () => {
  const eventoInvalido = {
    id: 1,
    titulo: "Estudiar"
  };

  expect(() =>
    procesarTareaCreada(eventoInvalido)
  ).toThrow("Evento TareaCreada inválido");
});