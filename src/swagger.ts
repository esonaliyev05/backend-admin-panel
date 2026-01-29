import swaggerJSDoc from "swagger-jsdoc";
import { config } from "./config";

export const swagger_spec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin + Website API",
      version: "1.0.0"
    },
    servers: [
      { url: `http://localhost:${config.port}`, description: "Local" }
    ],
    components: {
      securitySchemes: {
        AdminBearer: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        UserBearer: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    }
  },
  apis: ["./src/modules/**/*.ts"]
});
