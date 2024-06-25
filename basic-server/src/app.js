const fastify = require("fastify");
const fastifySwagger = require("@fastify/swagger");
const fastifySwaggerUI= require("@fastify/swagger-ui")
const {routes} = require("./routes/v1/books");
const jwt = require("@fastify/jwt");

const build = (opts = {}, optsSwaggerUI={}) => {
    const app = fastify(opts);
    app.register(fastifySwagger);
    app.register(fastifySwaggerUI, optsSwaggerUI)
    app.route(routes);


   

    return app;
};

module.exports = {build};