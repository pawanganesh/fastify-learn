const fastify = require('fastify')

const dbconnector = require("./plugins/db")

const { AuthRoute } = require("./routes/authRoute");

function app(opts) {
    const server = fastify(opts);

    server.register(dbconnector)
    server.register(AuthRoute, { prefix: "/auth" });

    return server;
}

module.exports = app;
