import z from "zod";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().int().positive().default(5000),
  DB_URL: z.string(),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(12),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION: z.string(),
  JWT_REFRESH_EXPIRATION: z.string(),
});

let config: z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);


if (!result.success)
  throw new Error(
    "Invalid environment variables:\n" + JSON.stringify(z.treeifyError(result.error), null, 2)
  );
else config = result.data;

export default config;
