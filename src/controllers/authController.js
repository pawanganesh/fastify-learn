require("dotenv").config();
const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../helpers/password");
const { sendGridMail } = require("../helpers/email");
const { GenerateUserVerificationToken } = require("../helpers/token");

async function userRegisterController(request, reply) {
    try {
        const userRequest = request.body;
        // TODO: check if user already exists
        const hashedPassword = await hashPassword(userRequest.password);  // hash password
        const query = {
            text: `INSERT INTO users (username, email, password) \
            VALUES ($1, $2, $3) RETURNING user_id, username, email;`,
            values: [userRequest.username, userRequest.email, hashedPassword]
        }
        const { rows } = await this.db.client.query(query);

        // send welcome email using sendgrid api
        // await sendGridMail(rows[0].email, `Welcome to our family ${userRequest.username}`,
        //     "Congratulations, You have successfully register an account!")

        // send verification email
        const verification_token = GenerateUserVerificationToken(rows[0].email, rows[0].user_id)
        const verification_link = `http://127.0.0.1:3000/auth/verify/${verification_token}`
        await sendGridMail(rows[0].email, `Please verify your email`, `Please click on this link to verify ${verification_link}`)

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
            text: `SELECT user_id, email, password, is_verified FROM users WHERE email = $1;`,
            values: [loginRequest.email]
        }
        const { rows } = await this.db.client.query(query);
        if (rows.length === 0) {
            return reply.code(401).send({ message: "Invalid email or password" });
        }
        if (!rows[0].is_verified) {
            return reply.code(401).send({ "message": "Please verify email to continue login" })
        }
        const isPasswordValid = await comparePassword(loginRequest.password, rows[0].password);  // comprare password
        if (isPasswordValid) {
            // TODO: update last_login to current date and time
            const token = jwt.sign({
                email: rows[0].email,
                user_id: rows[0].user_id
            },
                process.env.SECRET_KEY,
                {
                    algorithm: 'HS256',
                    expiresIn: '24h'
                })
            return { token }
        }
        return reply.code(401).send({ message: "Invalid email or password" })
    } catch (error) {
        return reply.code(400).send(error);
    }
}

async function UserVerificationController(request, reply) {
    const token = request.body['token'];
    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
        if (error) {
            return reply.code(401).send({
                message: error.message
            })
        }
        const query = {
            text: `SELECT * FROM users WHERE user_id=$1 AND email=$2;`,
            values: [decoded.user_id, decoded.email]
        }
        const { rows } = await this.db.client.query(query)
        console.log(rows)

        if (rows.length === 0) {
            return reply.code(401).send({
                message: "User verfication failed"
            })
        }

        if (rows[0].is_verified) {
            return reply.code(400).send({
                message: "User already verified"
            })
        }

        const updatequery = {
            text: `UPDATE users SET is_verified=$1 WHERE user_id=$2 AND email=$3;`,
            values: [true, decoded.user_id, decoded.email]
        }
        await this.db.client.query(updatequery)
        return reply.code(200).send({
            message: "User verified successfully"
        })
    })
    // return {
    //     "message": "I am of no use!"
    // }
}




module.exports = { userRegisterController, userLoginController, UserVerificationController };