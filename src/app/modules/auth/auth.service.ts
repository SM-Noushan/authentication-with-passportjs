import bcrypt from "bcrypt";
import status from "http-status";
import config from "../../config";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import decodeToken from "../../utils/decodeToken";
import { IAuthProvider } from "../user/user.interface";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TLoginUser, TRegisterUser } from "./auth.interface";
import { createUserTokens, generateToken } from "./auth.utils";
import { USER_AUTH_PROVIDER, USER_IS_ACTIVE } from "../user/user.constant";

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

// const loginUser = async (payload: TLoginUser) => {
//   const user = await User.findOne({ email: payload.email }).select("+password").lean();
//   if (!user || !user.password)
//     throw new AppError(status.UNAUTHORIZED, "Invalid email or password!");

//   const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
//   if (!isPasswordMatch) throw new AppError(status.UNAUTHORIZED, "Invalid email or password!");
//   delete user.password;

//   const tokenInfo = createUserTokens(user);

//   return { result: { user, ...tokenInfo }, tokenInfo };
// };

const changePassword = async (userId: string, newPassword: string, oldPassword: string) => {
  const user = await User.findById(userId).select("+password");

  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password!);
  if (!isOldPasswordMatch) throw new AppError(status.UNAUTHORIZED, "Old password is incorrect!");

  const hashedPassword = await bcrypt.hash(newPassword, config.BCRYPT_SALT_ROUNDS);
  user!.password = hashedPassword;
  await user!.save();

  return null;
};

const getNewAccessToken = async (refreshToken: string) => {
  const decoded = decodeToken(refreshToken, config.JWT_REFRESH_SECRET) as JwtPayload;

  const user = await User.findById(decoded.userId).lean();
  if (!user || user.isDeleted) throw new AppError(status.BAD_REQUEST, "User does not exist!");
  if (user.isActive === USER_IS_ACTIVE.BLOCKED || user.isActive === USER_IS_ACTIVE.INACTIVE)
    throw new AppError(status.BAD_REQUEST, `User is ${user.isActive.toLowerCase()}`);

  const jwtPayload = { userId: user._id, email: user.email, role: user.role };
  const accessToken = generateToken(
    jwtPayload,
    config.JWT_ACCESS_SECRET,
    config.JWT_ACCESS_EXPIRATION
  );

  return { accessToken };
};

export const AuthServices = {
  registerUser,
  // loginUser,
  changePassword,
  getNewAccessToken,
};
