const {build} = require("./app");
 
const app = build({logger : true }, {exposeRoute: true, routePrefix: "/docs",
   uiConfig: {
    docExpansion: "full",
    deepLinking: false,
   }
   }
);
 
app.then((a)=>{
    a.listen({
        port: 3000,
        host: "127.0.0.1",
    });
}
)