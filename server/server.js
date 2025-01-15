const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

async function startserver(){
  
  const PORT = process.env.PORT || 3001;
  const app = express();
// const routes = require('./routes');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const server= new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
}
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
})
// app.use(routes);
await server.start();
server.applyMiddleware({ app });

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

}
startserver();