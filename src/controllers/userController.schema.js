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


const changePasswordRequestSchema = {
    type: "object",
    required: ["old_password", "new_password", "confirm_password"],
    properties: {
        old_password: { type: "string" }, // TODO: validate password format
        new_password: { type: "string" },
        confirm_password: { type: "string" },
    },
    additionalProperties: false,
}
const commonMessageResponseSchema = {
    type: "object",
    properties: {
        message: { type: 'string' }
    }
}

const changePasswordSchema = {
    body: changePasswordRequestSchema,
    response: {
        200: commonMessageResponseSchema,
        400: commonMessageResponseSchema,
    }
}

const forgotPasswordRequestSchema = {
    body: {
        type: "object",
        required: ["email"],
        properties: {
            email: { type: "string" }
        },
        additionalProperties: false,
    },
    response: {
        200: commonMessageResponseSchema
    }
}
const forgotPasswordSchema = {
    body: {
        type: "object",
        required: ["new_password", "confirm_password"],
        properties: {
            new_password: { type: "string" },
            confirm_password: { type: "string" },
        },
        additionalProperties: false,
    },
    querystring: {
        type: 'object',
        required: ["verificationToken"],
        properties: {
            verificationToken: { type: 'string' },
        }
    },
    response: {
        200: commonMessageResponseSchema
    },
}

module.exports = {
    getUserSchema,
    updateUserSchema,
    changePasswordSchema,
    forgotPasswordRequestSchema,
    forgotPasswordSchema
}

// TODO: need code refactor