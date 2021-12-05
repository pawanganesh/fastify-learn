const app = require('./app');

const server = app({
    logger: {
        level: "debug",
        prettyPrint: true,
    },
    // pluginTimeout: 20000,
    // ajv: { customOptions: {} },
})

server.listen(3000,
    (error, address) => {
        if (error) {
            console.log(error)
            // process.exit(1)
        }

    });