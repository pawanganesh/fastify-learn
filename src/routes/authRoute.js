const { userRegisterController, userLoginController, UserVerificationController } = require("../controllers/authController");
const { RegisterSchema, LoginSchema, UserVerificationSchema } = require("../controllers/authController.schema");


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

    // POST /auth/verify/:token
    fastify.post(
        "/verify",
        { schema: UserVerificationSchema },
        UserVerificationController
    )
};

module.exports = { AuthRoute };