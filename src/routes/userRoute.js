const RoleCheckPlugin = require("../plugins/role.plugin");
const {
    getUserProfile,
    UpdateProfilePicture,
    UpdateUserProfile,
    UpdateUserPassword,
    getForgotPasswordToken,
    updateForgotPassword,
} = require("../controllers/userController");
const {
    getUserSchema,
    updateUserSchema,
    changePasswordSchema,
    forgotPasswordRequestSchema,
    forgotPasswordSchema,
} = require("../controllers/userController.schema");
const { photoUpload } = require("../helpers/storage");
const { default: fastify } = require("fastify");


const UserProtectedRoute = async (fastify) => {
    // Initial check for logged in users, drop request without serialization
    fastify.register(RoleCheckPlugin, { loggedOutOnly: false });

    // Get user profile
    fastify.get("/", { schema: getUserSchema }, getUserProfile)

    // Update profile picture
    fastify.post("/profile-picture", { preHandler: photoUpload.single("profile_picture") }, UpdateProfilePicture)

    // Update profile details
    fastify.patch("/", { schema: updateUserSchema }, UpdateUserProfile)

    // Change password
    fastify.patch("/change-password", { schema: changePasswordSchema }, UpdateUserPassword)
};

const UserRoute = async (fastify) => {
    // Send password reset link
    fastify.post("/forgot-password", { schema: forgotPasswordRequestSchema }, getForgotPasswordToken)
    // TODO: Password reset
    fastify.patch("/forgot-password/", { schema: forgotPasswordSchema }, updateForgotPassword)
    //127.0.0.1:3000/user/forgot-password/?verificationToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhd2FubGFsZ2FuZXNoQGdtYWlsLmNvbSIsInVzZXJfaWQiOjksImlhdCI6MTYzOTIzNTU2NiwiZXhwIjoxNjM5MzIxOTY2fQ.nbOHmN3tFK6hrwP2HbazqC0gl28SbLDBTzL2TBA13LU
};

module.exports = { UserRoute, UserProtectedRoute }