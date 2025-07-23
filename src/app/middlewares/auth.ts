import config from "../config";
import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import decodeToken from "../utils/decodeToken";
import { User } from "../modules/user/user.model";
import { NextFunction, Request, Response } from "express";
import { USER_IS_ACTIVE, USER_ROLE } from "../modules/user/user.constant";

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    // if token is present
    if (!token) throw new AppError(status.UNAUTHORIZED, "You are not authorized!");

    const decoded = decodeToken(token, config.JWT_ACCESS_SECRET) as JwtPayload;
    const { role, userId } = decoded;

    // validate user => check if user exists, is deleted, is active, etc.
    const user = await User.findById(userId).select("role isDeleted isActive isVerified").lean();

    if (!user || user.isDeleted) throw new AppError(status.UNAUTHORIZED, "You are not authorized!");
    if (user.isActive === USER_IS_ACTIVE.BLOCKED)
      throw new AppError(status.UNAUTHORIZED, "Your account is blocked!");
    if (user.isActive === USER_IS_ACTIVE.INACTIVE)
      throw new AppError(status.UNAUTHORIZED, "Your account is inactive!");
    // if (!user.isVerified) throw new AppError(status.UNAUTHORIZED, "You need to verify your account!");

    //   check if user has required role
    if (requiredRoles.length > 0 && !requiredRoles.includes(role))
      throw new AppError(status.FORBIDDEN, "You do not have permission to access this resource!");

    req.user = decoded;
    next();
  });

export default auth;
