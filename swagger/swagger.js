const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "ARTIN 시리즈 API",
      description: "ARTIN API 명세서",
    },
    host: "localhost:3000",
    schemes: ["http", "https"],
    basePath: "/",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/swagger/*.js"],
};

const specs = swaggerJsDoc(options);
module.exports = {
  swaggerUi,
  specs,
};
