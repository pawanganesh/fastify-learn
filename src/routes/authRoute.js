const { userRegisterController, userLoginController, UserVerificationController } = require("../controllers/authController");
const { RegisterSchema, LoginSchema, UserVerificationSchema } = require("../controllers/authController.schema");
const RoleCheckPlugin = require("../plugins/role.plugin");


const AuthRoute = async (fastify) => {
    // Initial check for logged in users, drop request without serialization
    fastify.register(RoleCheckPlugin, { loggedOutOnly: true });

    // POST /auth/register
    fastify.post("/register", { schema: RegisterSchema }, userRegisterController);

    //POST /auth/token
    fastify.post("/token", { schema: LoginSchema }, userLoginController);

    // POST /auth/verify/:token
    fastify.post("/verify", { schema: UserVerificationSchema }, UserVerificationController)
};

module.exports = { AuthRoute };