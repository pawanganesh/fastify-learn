require("dotenv").config();
const jwt = require("jsonwebtoken");
const { sendGridMail } = require("../helpers/email");
const { hashPassword, comparePassword } = require("../helpers/password");
const { updateQueryGenerator } = require("../helpers/querybuilder");
const { GenerateUserVerificationToken } = require("../helpers/token");

const responseData = (user_detail, protocol, hostname) => {
    respData = {
        user_id: user_detail.user_id,
        username: user_detail.username,
        email: user_detail.email,
        profile_picture: user_detail.profile_picture != "" ? protocol + "://" + hostname + user_detail.profile_picture : null,
        is_verified: user_detail.is_verified,
        created_at: user_detail.created_at,
        updated_at: user_detail.updated_at,
        last_login: user_detail.last_login,
    };
    return respData;
}

async function getUserProfile(request, reply) {
    console.log(request.protocol)
    console.log(request.hostname)
    // console.log(request)

    const query = {
        text: `SELECT user_id, username, email, profile_picture, is_verified, created_at, updated_at, last_login FROM users WHERE user_id=$1;`,
        values: [request.user.user_id]
    }
    const { rows } = await this.db.client.query(query)
    return responseData(rows[0], request.protocol, request.hostname)
}

async function UpdateProfilePicture(request, reply) {
    console.log(request.file)
    const query = {
        text: `UPDATE users SET profile_picture=$1 WHERE user_id=$2;`,
        values: ["/images/profile-picture/" + request.file.filename, request.user.user_id]
    }
    const { rows } = await this.db.client.query(query)
    return {
        message: "Profile picture updated"
    };
}

async function UpdateUserProfile(request, reply) {
    const { text, values } = updateQueryGenerator("users", request.body, { user_id: request.user.user_id })
    const query = { text, values }
    const { rows } = await this.db.client.query(query)
    return responseData(rows[0], request.protocol, request.hostname)
}

async function UpdateUserPassword(request, reply) {
    const { old_password, new_password, confirm_password } = request.body
    const { user_id } = request.user
    if (new_password != confirm_password) {
        return reply.status(400).send({ message: "New password and confirm password should match" })
    } else if (new_password === old_password) {
        return reply.status(400).send({ message: "New password and old password cannot be same" })
    }
    const query = {
        text: `SELECT password FROM users WHERE user_id = $1;`,
        values: [user_id]
    }
    const { rows } = await this.db.client.query(query)
    const isPasswordValid = await comparePassword(old_password, rows[0].password);  // comprare password
    if (isPasswordValid) {
        // Change password permission granted
        const hashedPassword = await hashPassword(new_password);  // hash password
        const updateQuery = {
            text: `UPDATE users SET password=$1 WHERE user_id=$2;`,
            values: [hashedPassword, user_id]
        }
        await this.db.client.query(updateQuery)
        return { message: "Password updated successfully" }
    } else {
        return reply.status(400).send({ message: "Your old password is incorrect" })
    }
}

async function getForgotPasswordToken(request, reply) {
    const { email } = request.body
    const query = {
        text: `SELECT user_id FROM users WHERE email=$1;`,
        values: [email]
    }
    const { rows } = await this.db.client.query(query)
    if (rows.length === 0) {
        return reply.code(400).send({ message: "No account found with this email" });
    }
    // Generate token
    const verification_token = GenerateUserVerificationToken(email, rows[0].user_id)
    const verification_link = `http://127.0.0.1:3000/user/forgot-password/${verification_token}`
    // Send email
    await sendGridMail(email, `Forgot password`, `Please click on this link to change password ${verification_link}`)
    return { message: "Password reset link has been sent" }
}

async function updateForgotPassword(request, reply) {
    const { new_password, confirm_password } = request.body
    const { verificationToken } = request.query
    if (new_password != confirm_password) {
        return reply.status(400).send({ message: "New password and confirm password should be same" })
    }
    jwt.verify(verificationToken, process.env.SECRET_KEY, async (error, decoded) => {
        if (error) {
            return reply.code(401).send({
                message: error.message
            })
        }
        const query = {
            text: `SELECT user_id FROM users WHERE user_id=$1 AND email=$2;`,
            values: [decoded.user_id, decoded.email]
        }
        const { rows } = await this.db.client.query(query)

        if (rows.length === 0) {
            return reply.code(401).send({
                message: "Verification token malformed"
            })
        }

        const hashedPassword = await hashPassword(new_password);  // hash password
        const updateQuery = {
            text: `UPDATE users SET password=$1 WHERE user_id=$2 AND email=$3;`,
            values: [hashedPassword, decoded.user_id, decoded.email]
        }

        await this.db.client.query(updateQuery)
        // return { message: "Password reset successfull" }
        return reply.code(200).send({
            message: "Password reset successfull"
        })
    })
}

module.exports = {
    getUserProfile,
    UpdateProfilePicture,
    UpdateUserProfile,
    UpdateUserPassword,
    getForgotPasswordToken,
    updateForgotPassword
}

// TODO: code refactor needed