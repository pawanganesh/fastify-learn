require("dotenv").config();

const fastifyPlugin = require("fastify-plugin");

const jwt = require("jsonwebtoken");
const { invalidToken, noAuthTokenProvided } = require("../helpers/replies");


// Current role
// loggedOutOnly: true
// loggedOutOnly: false

const RoleCheck = (fastify, options, done) => {
    // set request.user to null initially
    fastify.decorateRequest("user", null);

    fastify.addHook("onRequest", async (request, reply) => {
        // TODO: drop request check if role is not set yet
        // check if logged out only
        if (options.loggedOutOnly) {
            console.log("I am inside logged out only");
            return;
        }
        // decode token from request
        const token = request.headers.authorization || "";
        if (token === "") {
            return noAuthTokenProvided({ reply });
        }
        const authtoken = token.split(" ")[1];
        // decode jwt and check on db
        const decoded = checkJWt(authtoken);
        // console.log(decoded)
        if (!decoded) {
            console.log("I am inside if user null");
            return invalidToken({ reply })
        }
        const query = {
            text: `SELECT user_id, username, email FROM users WHERE user_id=$1 AND email=$2;`,
            values: [decoded.user_id, decoded.email]
        }
        const { rows } = await fastify.db.client.query(query)
        if (rows.length === 0) {
            return reply.code(401).send({
                message: "Auth token malformed"
            })
        }
        request.user = rows[0]
        return;
    });
    done();
}

const checkJWt = token => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return undefined;
    }
}

const RoleCheckPlugin = fastifyPlugin(RoleCheck);
module.exports = RoleCheckPlugin