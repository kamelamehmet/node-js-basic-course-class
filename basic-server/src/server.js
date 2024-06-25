const { build } = require("./app");

const app = build(
  { logger: true },
  {
    routePrefix: '/docs',
    uiConfig: {
      deepLinking: false
    },
    uiHooks: {
      onRequest: function(request, reply, next) { next() },
      preHandler: function(request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  }
);

app.listen({ port: 3000, host: "127.0.0.1" })
