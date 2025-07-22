import { Types } from "mongoose";
import { USER_AUTH_PROVIDER, USER_IS_ACTIVE, USER_ROLE } from "./user.constant";

export interface IAuthProvider {
  provider: USER_AUTH_PROVIDER;
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: USER_IS_ACTIVE;
  isVerified?: boolean;
  role: USER_ROLE;
  auths: IAuthProvider[];
}
