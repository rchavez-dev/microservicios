const typeDefs = `#graphql
  type Plato {
    id: ID!
    nombre: String!
    categoria: String
    precio: Float
  }

  type ItemPedido {
    id: ID!
    pedidoId: ID!
    platoId: ID!
    plato: Plato
    cantidad: Int!
    precioUnitario: Float!
  }

  type Pedido {
    id: ID!
    mesaOCliente: String!
    fecha: String!
    estado: String!
    total: Float!
    items: [ItemPedido!]!
  }

  type Query {
    pedidos: [Pedido!]!
    pedido(id: ID!): Pedido
  }

  type Mutation {
    crearPedido(mesaOCliente: String!): Pedido!
    actualizarCantidadItem(itemId: ID!, nuevaCantidad: Int!): ItemPedido!
  }
`;

module.exports = typeDefs;