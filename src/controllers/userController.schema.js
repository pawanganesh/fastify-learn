// getUser response
const userObjectSchema = {
    type: "object",
    properties: {
        user_id: { type: "number" },
        username: { type: "string" },
        email: { type: "string", format: "email" },
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

module.exports = { getUserSchema }
