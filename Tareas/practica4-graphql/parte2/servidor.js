const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const depthLimit = require('graphql-depth-limit');
const typeDefs = require('./esquema');
const resolvers = require('./resolvers');
const { crearCargadores } = require('./cargadores');

const enProduccion = process.env.NODE_ENV === 'production';

const server = new ApolloServer({
  introspection: !enProduccion,
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)],
  formatError: (err) => {
    console.error('[GraphQL Error]', err.message);
    return {
      message: err.message,
      code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
      path: err.path,
    };
  },
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
    context: async () => ({ cargadores: crearCargadores() }),
  });
  console.log('Servidor GraphQL (Parte 2) escuchando en ' + url);
}

main();