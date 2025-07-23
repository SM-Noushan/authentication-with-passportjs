import jwt from "jsonwebtoken";
import status from "http-status";
import AppError from "../errors/AppError";

const decodeToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (_err) {
    throw new AppError(status.UNAUTHORIZED, "TokenError: Invalid or expired token");
  }
};

export default decodeToken;
