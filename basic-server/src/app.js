const fastify = require("fastify");
const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUI = require("@fastify/swagger-ui")
const { bookRoutes } = require("./routes/v1/books");
const postgres = require("@fastify/postgres")
require('dotenv').config();

const build = (opts = {}, optsSwaggerUI = {}) => {
  const app = fastify(opts);
  app.register(fastifySwagger);
  app.register(fastifySwaggerUI, optsSwaggerUI)
  app.register(bookRoutes)
  app.register(postgres, {
    connectionString: "postgresql://student:student@127.0.0.1:5432/library"

})
  return app;
};

module.exports = { build };
