const DataLoader = require('dataloader');
const { q } = require('./db');

function crearCargadores() {
  const itemsPorPedido = new DataLoader(async (pedidoIds) => {
    const filas = await q(
      'SELECT id, pedido_id, plato_id, cantidad, precio_unitario AS precioUnitario ' +
      'FROM items_pedido WHERE pedido_id IN (?)',
      [pedidoIds]
    );
    return pedidoIds.map(id => filas.filter(f => f.pedido_id === id));
  });

  return { itemsPorPedido };
}

module.exports = { crearCargadores };