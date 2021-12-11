const path = require("path")

const Fastify = require('fastify');
const multer = require("fastify-multer");
const fastifyStatic = require("fastify-static");

const dbconnector = require("./plugins/db.plugin");
const { Handler404 } = require('./helpers/replies');
const { AuthRoute } = require("./routes/authRoute");
const { UserRoute, UserProtectedRoute } = require('./routes/userRoute');

function app(opts) {
    const server = Fastify(opts);
    server.register(multer.contentParser);
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
    server.register(fastifyStatic, {
        root: path.join(__dirname, 'images'),
        prefix: "/images/",
    })
    server.register(AuthRoute, { prefix: "/auth" });

    server.register(UserProtectedRoute, { prefix: "/user" });
    server.register(UserRoute, { prefix: "/user" });

    return server;
}

module.exports = app;
