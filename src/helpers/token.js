require("dotenv").config();

const jwt = require('jsonwebtoken');

const GenerateUserVerificationToken = (email, user_id) => {
    const token = jwt.sign(
        { email, user_id },
        process.env.SECRET_KEY,
        { algorithm: 'HS256', expiresIn: '24h' }
    )
    return token
}

module.exports = { GenerateUserVerificationToken }