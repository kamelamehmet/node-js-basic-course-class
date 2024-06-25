const getItemsOpts = {
    schema: {
        description: 'post some data',
        tags: [ 'user', 'code'],
        summary: 'qwery',
        params:{
            id: {type: "string"},

        },
        response: {
            200: {
                type: "object",
                properties: {
                    id: { type:"string"},
                    name: {type: "string"},
                    description: {type:"string"},
                    
                },
            },
        },
    },
};

module.exports={getItemsOpts};