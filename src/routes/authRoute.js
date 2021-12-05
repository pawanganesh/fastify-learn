const { userRegisterController } = require("../controllers/authController");
const { RegisterSchema } = require("../controllers/authController.schema");


const AuthRouter = async (fastify) => {

    // POST /auth/register
    fastify.post(
        "/register",
        { schema: RegisterSchema },
        userRegisterController
    );
};

module.exports = { AuthRouter };