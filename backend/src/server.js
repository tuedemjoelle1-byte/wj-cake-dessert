import { createServer } from "node:http";
import { loadEnvFile } from "./config/load-env.js";
import { createApp } from "./app.js";

loadEnvFile();

const port = Number(process.env.PORT || 4000);
const app = createApp();

const server = createServer((req, res) => {
  app(req, res);
});

server.listen(port, () => {
  console.log(`WJ API listening on http://localhost:${port}`);
});
