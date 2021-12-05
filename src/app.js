const fastify = require('fastify')

const dbconnector = require("./plugins/db")

const { AuthRouter } = require("./routes/authRoute");

function app(opts) {
    const server = fastify(opts);

    server.register(dbconnector)
    server.register(AuthRouter, { prefix: "/auth" });

    return server;
}

module.exports = app;
