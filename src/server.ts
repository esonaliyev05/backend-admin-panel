import { create_app } from "./app";
import { config } from "./config";

const app = create_app();

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Swagger: http://localhost:${config.port}/api/docs`);
});
