const app = require('./app');

const server = app({
    logger: {
        level: "debug",
        prettyPrint: true,
    },
    // ignoreTrailingSlash: true, // default false
    pluginTimeout: 20000, // default 10000 in miliseconds
    // ajv: { customOptions: {} },
})

server.listen(3000,
    (error, address) => {
        if (error) {
            console.log(error)
            process.exit(1)
        }
    });
