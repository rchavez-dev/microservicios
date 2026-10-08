const { calcularTotalConDescuento } = require("../src/descuento");

describe("calcularTotalConDescuento", () => {

  test("aplica correctamente un descuento normal", () => {
    const total = 100;
    const descuento = 20;

    const resultado = calcularTotalConDescuento(total, descuento);

    expect(resultado).toBe(80);
  });

  test("devuelve el mismo total cuando el descuento es cero", () => {
    const total = 100;
    const descuento = 0;

    const resultado = calcularTotalConDescuento(total, descuento);

    expect(resultado).toBe(100);
  });

  test("devuelve cero cuando el descuento es cien", () => {
    const total = 100;
    const descuento = 100;

    const resultado = calcularTotalConDescuento(total, descuento);

    expect(resultado).toBe(0);
  });

  test("permite total igual a cero", () => {
    const total = 0;
    const descuento = 50;

    const resultado = calcularTotalConDescuento(total, descuento);

    expect(resultado).toBe(0);
  });

  test("lanza error si el total es negativo", () => {
    expect(() =>
      calcularTotalConDescuento(-100, 20)
    ).toThrow("el total no puede ser negativo");
  });

  test("lanza error si el descuento supera cien", () => {
    expect(() =>
      calcularTotalConDescuento(100, 150)
    ).toThrow("el descuento debe estar entre 0 y 100");
  });

  test("lanza error si descuento no es un número", () => {
  expect(() =>
    calcularTotalConDescuento(100, "20")
  ).toThrow("total y descuento deben ser números");
  });

  test("lanza error si el descuento es negativo", () => {
  expect(() =>
    calcularTotalConDescuento(100, -10)
  ).toThrow("el descuento debe estar entre 0 y 100");
  });

});