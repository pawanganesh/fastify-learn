const RoleCheckPlugin = require("../plugins/role.plugin");
const {
    getUserProfile,
    UpdateProfilePicture,
    UpdateUserProfile,
    UpdateUserPassword
} = require("../controllers/userController");
const { getUserSchema, updateUserSchema } = require("../controllers/userController.schema");
const { photoUpload } = require("../helpers/storage");

const UserProtectedRoute = async (fastify) => {
    // Initial check for logged in users, drop request without serialization
    fastify.register(RoleCheckPlugin, { loggedOutOnly: false });

    // Get user profile
    fastify.get("/", { schema: getUserSchema }, getUserProfile)

    // Update profile picture
    fastify.post("/profile-picture", { preHandler: photoUpload.single("profile_picture") }, UpdateProfilePicture)

    // Update profile details
    fastify.patch("/", { schema: updateUserSchema }, UpdateUserProfile)

    // TODO: Change password
    fastify.patch("/change-password", UpdateUserPassword)

    // TODO: Forgot password
    fastify.get("/forgot-password", UpdateUserPassword)
    fastify.patch("/forgot-password", UpdateUserPassword)

}

module.exports = { UserProtectedRoute }