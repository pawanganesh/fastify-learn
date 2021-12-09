const RoleCheckPlugin = require("../plugins/role.plugin");
const { getUserProfile } = require("../controllers/userController");
const { getUserSchema } = require("../controllers/userController.schema");

const UserRoute = async (fastify) => {
    // Initial check for logged in users, drop request without serialization
    fastify.register(RoleCheckPlugin, { loggedOutOnly: false });

    // Get user profile
    fastify.get("/", { getUserSchema }, getUserProfile)

    // TODO: Update profile picture

    // TODO: Change password

    // TODO: Forgot password

}

module.exports = { UserRoute }