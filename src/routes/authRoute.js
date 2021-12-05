const { userRegisterController, userLoginController } = require("../controllers/authController");
const { RegisterSchema, LoginSchema } = require("../controllers/authController.schema");


const AuthRoute = async (fastify) => {

    // POST /auth/register
    fastify.post(
        "/register",
        { schema: RegisterSchema },
        userRegisterController
    );
    //POST /auth/token
    fastify.post(
        "/token",
        { schema: LoginSchema },
        userLoginController
    );
};

module.exports = { AuthRoute };