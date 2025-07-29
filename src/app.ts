import cors from "cors";
import passport from "passport";
import router from "./app/routes";
import config from "./app/config";
import "./app/middlewares/passport";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import notFound from "./app/middlewares/notFound";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(
  expressSession({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
// app.set("trust proxy", 1); // Trust first proxy for secure cookies if behind a reverse proxy
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));

app.use("/api", router);

app.get("/", async (req: Request, res: Response) => {
  res.send("Server is running successfully");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
