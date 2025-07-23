import bcrypt from "bcrypt";
import status from "http-status";
import config from "../../config";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";
import { createUserTokens } from "./auth.utils";
import { IAuthProvider } from "../user/user.interface";
import { USER_AUTH_PROVIDER } from "../user/user.constant";
import { TLoginUser, TRegisterUser } from "./auth.interface";

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

  const tokenInfo = createUserTokens(user.toObject());

  return { result: { user: user.toObject(), ...tokenInfo }, tokenInfo };
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select("+password").lean();
  if (!user || !user.password)
    throw new AppError(status.UNAUTHORIZED, "Invalid email or password!");

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) throw new AppError(status.UNAUTHORIZED, "Invalid email or password!");
  delete user.password;

  const tokenInfo = createUserTokens(user);

  return { result: { user, ...tokenInfo }, tokenInfo };
};

export const AuthServices = {
  registerUser,
  loginUser,
};
