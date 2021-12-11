const { updateQueryGenerator } = require("../helpers/querybuilder")

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
    return {}
}

module.exports = { getUserProfile, UpdateProfilePicture, UpdateUserProfile, UpdateUserPassword }