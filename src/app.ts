import cors from "cors";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import notFound from "./app/middlewares/notFound";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5000"],
  })
);

app.use("/api", router);

app.get("/", async (req: Request, res: Response) => {
  res.send("Server is running successfully");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
