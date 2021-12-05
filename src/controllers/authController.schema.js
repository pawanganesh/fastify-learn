const LoginRequestSchema = {
    type: "object",
    required: ["username", "password"],
    properties: {
        "username": { type: "string" },
        "password": { type: "string" }
    },
};

const RegisterRequestSchema = {
    type: "object",
    required: [...LoginRequestSchema.required, "email"],
    properties: {
        ...LoginRequestSchema.properties,
        "email": { type: "string", format: "email" }
    },
};

const RegisterResponseSchema = {
    type: "object",
    properties: {
        "username": { type: "string" },
        "email": { type: "string", format: "email" }
    }
}

const RegisterSchema = {
    body: RegisterRequestSchema,
    response: {
        200: RegisterResponseSchema
    },
}

module.exports = { LoginRequestSchema, RegisterSchema };