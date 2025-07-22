import jwt from "jsonwebtoken";
import { IUser } from "../user/user.interface";
import config from "../../config";

export const generateToken = (payload: jwt.JwtPayload, secret: string, expiresIn: string): string =>
  jwt.sign(payload, secret, {
    expiresIn,
  } as jwt.SignOptions);

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = { userId: user._id, email: user.email, role: user.role };

  const accessToken = generateToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRATION
  );
  const refreshToken = generateToken(
    jwtPayload,
    config.JWT_REFRESH_SECRET,
    config.JWT_REFRESH_EXPIRATION
  );

  return { accessToken, refreshToken };
};
