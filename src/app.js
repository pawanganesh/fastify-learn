const fastify = require('fastify')

const dbconnector = require("./plugins/db")

const { AuthRoute } = require("./routes/authRoute");

function app(opts) {
    const server = fastify(opts);

    server.register(dbconnector);
    server.register(require("fastify-swagger"), {
        exposeRoute: true,
        routePrefix: "/docs",
        swagger: {
            info: {
                title: "Fastify Learn",
                description: "This is dummy description for now",
                version: "1.0.0"
            },
            schemes: ['http', 'https',]
        }
    });
    server.register(AuthRoute, { prefix: "/auth" });

    return server;
}

module.exports = app;
