const{getItemsOpts} = require("../../schemas/v1/items");



const items = [
    {id:"1", name:"item 1", description: "item 1 description"},
{ id:"2", name:"item 2", description: "item 2 description"},
{id:"3", name:"item 3", description: "item 3 description"},
{id:"4", name:"item 4", description: "item 4 description"}]
 
const itemRoutes = (fastify , option, done) => {
    
    fastify.get("/items", (request, reply) => {
        return items
    });

    fastify.get("/items/:id", getItemsOpts, (request,reply)=>
    {
       const { id} = request.params; 

       const item = items.find((i) => i === id)

reply.send(item);
    });

    done()
}
 
module.exports={itemRoutes};