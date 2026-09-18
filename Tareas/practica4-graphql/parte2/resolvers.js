const { q } = require('./db');

const resolvers = {
  Query: {
    pedidos: () => q('SELECT id, mesa_o_cliente AS mesaOCliente, fecha, estado, total FROM pedidos ORDER BY id'),
    pedido: async (_, { id }) => {
      const filas = await q('SELECT id, mesa_o_cliente AS mesaOCliente, fecha, estado, total FROM pedidos WHERE id = ?', [id]);
      return filas[0] || null;
    },
  },

  Pedido: {
    items: (pedido, _args, { cargadores }) => {
      return cargadores.itemsPorPedido.load(pedido.id);
    },
  },

  ItemPedido: {
    plato: async (item) => {
      try {
        const res = await fetch(`http://localhost:3001/platos/${item.plato_id}`);
        if (!res.ok) return null;
        return await res.json();
      } catch (err) {
        return null;
      }
    },
  },

  Mutation: {
    crearPedido: async (_, { mesaOCliente }) => {
      const res = await q('INSERT INTO pedidos (mesa_o_cliente, estado, total) VALUES (?, "PENDIENTE", 0.00)', [mesaOCliente]);
      return { id: res.insertId, mesaOCliente, fecha: new Date().toISOString(), estado: 'PENDIENTE', total: 0.00, items: [] };
    },

    actualizarCantidadItem: async (_, { itemId, nuevaCantidad }) => {
      if (nuevaCantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a cero');
      }
      await q('UPDATE items_pedido SET cantidad = ? WHERE id = ?', [nuevaCantidad, itemId]);
      const filas = await q('SELECT id, pedido_id, plato_id, cantidad, precio_unitario AS precioUnitario FROM items_pedido WHERE id = ?', [itemId]);
      if (!filas[0]) throw new Error('Item no encontrado');
      return filas[0];
    },
  },
};

module.exports = resolvers;