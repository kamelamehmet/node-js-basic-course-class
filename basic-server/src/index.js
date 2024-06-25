const fastify = require('fastify')({ logger: true });
const routes = require('./routes');
const swagger = require('./swagger');

fastify.register(require('fastify-swagger'), swagger.options);

routes.forEach(route => {
  fastify.route(route);
});

const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.swagger();
    fastify.log.info(`Server is running at http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
