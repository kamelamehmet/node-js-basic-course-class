const fastify = require("fastify");
const fastifySwaggerUI =  require("@fastify/swagger-ui");
const fastifySwagger =  require("@fastify/swagger");



const {itemRoutes} = require("./routes/v1/items");

const build = async (opts={}, swaggerOpts = {})=> {
    const app = fastify(opts);
    
    await app.register(fastifySwagger)
    await app.register(fastifySwaggerUI, swaggerOpts)

    await app.register(itemRoutes);
   
    return await app. ready();

}

module.exports={build};