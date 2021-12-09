async function getUserProfile(request, reply) {
    const query = {
        text: `SELECT username, email, is_verified, created_at, updated_at, last_login FROM users WHERE user_id=$1;`,
        values: [request.user.user_id]
    }
    const { rows } = await this.db.client.query(query)
    return { userprofile: rows[0] };
}

module.exports = { getUserProfile }