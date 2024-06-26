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
  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Library API',
        description: 'Library API documentation with JWT authentication',
        version: '1.0.0',
      },
      host: '127.0.0.1:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: "Enter your bearer token in the format **Bearer &lt;token>**",
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    }
  });
  app.register(fastifySwaggerUI, optsSwaggerUI)
  app.register(jwt, {
    secret: "kjghfjh"
  });
  app.register(bookRoutes)
  app.register(authRoutes)
  app.register(postgres, {
    connectionString: process.env.CONNECTION_STRING
  })

  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      console.log("Not authorized")
    }
  })
  return app;
}
module.exports = { build };
