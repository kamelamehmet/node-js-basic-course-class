const fastify = require("fastify");
const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUI = require("@fastify/swagger-ui")
const { bookRoutes } = require("./routes/v1/books");
const { authRoutes } = require("./routes/v1/auth");
const postgres = require("@fastify/postgres")
const jwt = require("@fastify/jwt")
require('dotenv').config();

const build = (opts = {}, optsSwaggerUI = {}) => {
  const app = fastify(opts);
  app.register(fastifySwagger);
  app.register(fastifySwaggerUI, optsSwaggerUI)
  app.register(jwt, {
    secret: "SECRET_KEY"
  })
  app.register(bookRoutes)
  app.register(authRoutes)
  app.register(postgres, {
    connectionString: process.env.CONNECTION_STRING
  })
  app.register(jwt, {
    secret: "kjghfjh"
  });
  return app;
};

module.exports = { build };
