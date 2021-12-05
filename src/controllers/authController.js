require("dotenv").config();
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../helpers/password");

async function userRegisterController(request, reply) {
    try {
        const userRequest = request.body;
        const hashedPassword = await hashPassword(userRequest.password);  // hash password
        const query = {
            text: `INSERT INTO users (username, email, password) \
            VALUES ($1, $2, $3) RETURNING username, email;`,
            values: [userRequest.username, userRequest.email, hashedPassword]
        }
        const { rows } = await this.db.client.query(query);
        return {
            username: rows[0].username,
            email: rows[0].email,
        };
    }
    catch (error) {
        return reply.code(400).send(error);
    }
}

async function userLoginController(request, reply) {
    try {
        const loginRequest = request.body;
        const query = {
            text: `SELECT id, email, password FROM users WHERE email = $1;`,
            values: [loginRequest.email]
        }
        const { rows } = await this.db.client.query(query);
        if (rows.length === 0) {
            return reply.code(401).send({ message: "Invalid email or password" });
        }
        const isPasswordValid = await comparePassword(loginRequest.password, rows[0].password);  // comprare password
        if (isPasswordValid) {
            const token = jwt.sign({ email: rows[0].email, user_id: rows[0].id }, process.env.SECRET_KEY)
            return { token }
        }
        return reply.code(401).send({ message: "Invalid email or password" })

    } catch (error) {
        return reply.code(400).send(error);
    }
}

module.exports = { userRegisterController, userLoginController };