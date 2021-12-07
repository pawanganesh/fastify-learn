const LoginRequestSchema = {
    type: "object",
    required: ["email", "password"],
    properties: {
        "email": { type: "string", format: "email" },
        "password": { type: "string" }
    },
};

const LoginResponseSchema = {
    type: "object",
    properties: {
        "message": { type: "string", default: "Login successful" },
        "token": { type: "string" },
    }
}

const LoginSchema = {
    body: LoginRequestSchema,
    response: {
        200: LoginResponseSchema
    }
}

const RegisterRequestSchema = {
    type: "object",
    required: [...LoginRequestSchema.required, "username"],
    properties: {
        ...LoginRequestSchema.properties,
        "username": { type: "string" }
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

const UserVerificationSchema = {
    body: {
        type: "object",
        required: ["token"],
        properties: {
            token: { type: 'string' }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                message: { type: 'string' }
            }
        }
    }
}

module.exports = { LoginSchema, RegisterSchema, UserVerificationSchema };