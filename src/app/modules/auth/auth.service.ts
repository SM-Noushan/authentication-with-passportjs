import bcrypt from "bcrypt";
import status from "http-status";
import config from "../../config";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { createUserTokens } from "./auth.utils";
import { TRegisterUser } from "./auth.interface";
import { IAuthProvider } from "../user/user.interface";
import { USER_AUTH_PROVIDER } from "../user/user.constant";

const registerUser = async (payload: TRegisterUser) => {
  const { email, password, ...rest } = payload;
  const isUserExists = await User.countDocuments({ email });
  if (isUserExists) throw new AppError(status.BAD_REQUEST, "User already exists!");

  const hashedPassword = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  const authProvider: IAuthProvider = {
    provider: USER_AUTH_PROVIDER.CREDENTIALS,
    providerId: email,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  const tokenInfo = createUserTokens(user);

  return { user, ...tokenInfo };
};

export const AuthServices = {
  registerUser,
};
