const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');

const trabajadorRoutes = require('./routes/trabajador.routes');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const app = express();

app.use(cors());
app.use(express.json());


// ========================
// REST
// ========================

app.use('/trabajador', trabajadorRoutes);


// ========================
// GRAPHQL
// ========================

const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers
});


async function iniciarServidor() {

    // Iniciar Apollo
    await graphqlServer.start();

    // Conectar GraphQL con Express
    app.use(
        '/graphql',
        express.json(),
        expressMiddleware(graphqlServer)
    );

  //  AHORA (se adapta automáticamente si estás en local o en Docker)
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trabajadores';
    await mongoose.connect(MONGO_URI);

    console.log('Conectado a MongoDB');

    // Levantar servidor
    app.listen(3000, () => {
        console.log('Servidor ejecutándose en http://localhost:3000');
        console.log('GraphQL disponible en http://localhost:3000/graphql');
    });
}


iniciarServidor()
    .catch((error) => {
        console.error('Error al iniciar el servidor:', error);
    });