import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import logger from "./lib/logger.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV }, "Server iniciado");
});
