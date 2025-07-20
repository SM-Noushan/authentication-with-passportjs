import app from "./app";
import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.DB_URL);

    server = app.listen(config.PORT, () => {
      console.log("Server is running on port:", config.PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on("unhandledRejection", () => {
  if (server) server.close(() => process.exit(1));
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("Uncaught Exception! Shutting down...");
  process.exit(1);
});
