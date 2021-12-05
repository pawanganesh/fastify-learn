const { compare, hash } = require("bcrypt");

const SALT_ROUND = 10;

const hashPassword = async (plainPassword) => {
    const hashedPassword = await hash(plainPassword, SALT_ROUND)
    return hashedPassword;
}

const comparePassword = async (plainPassword, hashedPassword) => {
    const isValid = await compare(plainPassword, hashedPassword)
    return isValid;
}

module.exports = { hashPassword, comparePassword };