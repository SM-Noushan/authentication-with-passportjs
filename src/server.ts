/* eslint-disable no-console */
import app from "./app";
import { Server } from "http";
import config from "./app/config";
import connectMongoDB from "./app/config/db";
import { connectRedis } from "./app/config/redis";

let server: Server;

async function startServer() {
  try {
    server = app.listen(config.PORT, () => {
      console.log("🔥 Server is running on port:", config.PORT);
    });
  } catch (error) {
    console.error("❌ Failed to start server...", error);
  }
}

(async () => {
  await connectRedis();
  await connectMongoDB();
  await startServer();
})();

process.on("SIGTERM", () => {
  console.log("❌ SIGTERM Signal Received! Shutting down...");
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("❌ SIGINT Signal Received! Shutting down...");
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("❌ Unhandled Rejection! Shutting down...", err);
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});

process.on("uncaughtException", err => {
  console.error("❌ Uncaught Exception! Shutting down...", err);
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});
