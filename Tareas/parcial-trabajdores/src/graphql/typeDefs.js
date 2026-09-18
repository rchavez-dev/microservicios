const typeDefs = `#graphql

    type Trabajador {
        id: ID!
        nombre: String!
        apellido: String!
        cedula: String!
        cargo: String!
        departamento: String!
        fechaIngreso: String!
    }

    input TrabajadorInput {
        nombre: String!
        apellido: String!
        cedula: String!
        cargo: String!
        departamento: String!
        fechaIngreso: String!
    }

    type Query {
        obtenerTrabajadores: [Trabajador!]!
        obtenerTrabajador(id: ID!): Trabajador
    }

    type Mutation {
        crearTrabajador(input: TrabajadorInput!): Trabajador!
        actualizarTrabajador(id: ID!, input: TrabajadorInput!): Trabajador
        eliminarTrabajador(id: ID!): Trabajador
    }
`;

module.exports = typeDefs;