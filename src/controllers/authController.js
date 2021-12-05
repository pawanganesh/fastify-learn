
async function userRegisterController(request, reply) {
    try {
        const userRequest = request.body;
        // TODO: hash password
        const query = {
            text: `INSERT INTO users (username, email, password) \
            VALUES ($1, $2, $3) RETURNING username, email;`,
            values: [userRequest.username, userRequest.email, userRequest.password]
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

module.exports = { userRegisterController };