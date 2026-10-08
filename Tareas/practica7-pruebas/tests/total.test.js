const { calcularTotal } = require("../src/total");

test("no permite que un descuento mayor al 100 produzca un total negativo", () => {
  const items = [
    {
      precio: 100,
      cantidad: 1
    }
  ];

  const resultado = calcularTotal(items, 150);

  expect(resultado).toBe(0);
});