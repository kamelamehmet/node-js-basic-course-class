const { build } = require("./app");

const app = build(
  { logger: true },
  {
    routePrefix: '/docs',
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
    },
    uiConfig: {
      deepLinking: true,
      displayRequestDuration: true,
      persistAuthorization: true,
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true,
  }
);

app.listen({ port: 3000, host: "127.0.0.1" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});
