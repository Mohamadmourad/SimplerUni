const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SimplerUni API",
            version: "1.0.0",
            description: "API documentation for SimplerUni",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development Server",
            },
        ],
    },
    apis: [__dirname + "/swaggerRoutes.js"]
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
