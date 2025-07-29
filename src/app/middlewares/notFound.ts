import status from "http-status";
import { NextFunction, Request, Response } from "express";

 
const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "API Not Found!!",
    error: "",
  });
};

export default notFound;
