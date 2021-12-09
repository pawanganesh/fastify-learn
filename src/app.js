const fastify = require('fastify');
const { Handler404 } = require('./helpers/replies');

const dbconnector = require("./plugins/db.plugin");

const { AuthRoute } = require("./routes/authRoute");
const { UserRoute } = require('./routes/userRoute');

function app(opts) {
    const server = fastify(opts);

    server.register(dbconnector);
    server.setNotFoundHandler(Handler404);

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
    server.register(UserRoute, { prefix: "/user" });

    return server;
}

module.exports = app;
