import { ZodObject } from "zod";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

const validateRequest = (schema: ZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedPayload = await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    req.body = parsedPayload.body;
    return next();
  });

export default validateRequest;
