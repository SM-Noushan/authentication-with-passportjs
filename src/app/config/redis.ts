/* eslint-disable no-console */
import config from ".";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

const redisClient = createClient({
  username: config.REDIS_USERNAME,
  password: config.REDIS_PASSWORD,
  socket: { host: config.REDIS_HOST, port: config.REDIS_PORT },
});

redisClient.on("error", err => console.error("❌ Redis Client Error...", err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("✅ Redis client connected");
  }
};

const redisStore = new RedisStore({
  client: redisClient,
  ttl: 7 * 24 * 60 * 60,
});

export { connectRedis, redisStore };
