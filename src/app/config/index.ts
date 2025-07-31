import z from "zod";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().int().positive().default(5000),
  MongoDB_URI: z.string().min(20),
  REDIS_USERNAME: z.string().min(3),
  REDIS_PASSWORD: z.string().min(10),
  REDIS_HOST: z.string().min(20),
  REDIS_PORT: z.coerce.number().int().positive(),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(12),
  JWT_ACCESS_SECRET: z.string().min(5),
  JWT_REFRESH_SECRET: z.string().min(5),
  JWT_ACCESS_EXPIRATION: z.string().min(2),
  JWT_REFRESH_EXPIRATION: z.string().min(2),
  GOOGLE_CLIENT_ID: z.string().min(10),
  GOOGLE_CLIENT_SECRET: z.string().min(10),
  FACEBOOK_APP_ID: z.string().min(10),
  FACEBOOK_APP_SECRET: z.string().min(10),
  FACEBOOK_CALLBACK_URL: z.url(),
  FRONTEND_URL: z.string().min(10),
  GOOGLE_CALLBACK_URL: z.url(),
  SESSION_SECRET: z.string().min(10).default("defaultSecret"),
  CORS_ORIGIN: z.url().default("http://localhost:5000"),
});

let config: z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success)
  throw new Error(
    "Invalid environment variables:\n" + JSON.stringify(z.treeifyError(result.error), null, 2)
  );
else config = result.data;

export default config;
