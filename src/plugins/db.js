require("dotenv").config();
const fastifyPlugin = require("fastify-plugin");
const { Client } = require('pg');


const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
})

async function dbconnector(fastify, options) {
    try {
        await client.connect()
        fastify.log.info("Db connected")
        fastify.decorate('db', { client })
    } catch (error) {
        fastify.log.info(error)
    }
}

module.exports = fastifyPlugin(dbconnector)