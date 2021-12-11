// getUser response
const userObjectSchema = {
    type: "object",
    properties: {
        user_id: { type: "number" },
        username: { type: "string" },
        email: { type: "string", format: "email" },
        profile_picture: { type: "string", nullable: true },
        is_verified: { type: "boolean" },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
        last_login: { type: "string", format: "date-time", nullable: true },
    },
    additionalProperties: false,
};

const getUserSchema = {
    reponse: {
        "2xx": userObjectSchema,
    },
};

const updateUserSchema = {
    body: {
        type: "object",
        properties: {
            username: { type: "string" },
            email: { type: "string", format: "email" },
        },
        additionalProperties: false,
    },
    response: {
        200: userObjectSchema
    },
};

module.exports = { getUserSchema, updateUserSchema }
