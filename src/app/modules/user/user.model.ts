import { model, Schema } from "mongoose";
import { IAuthProvider, IUser } from "./user.interface";
import { USER_AUTH_PROVIDER, USER_IS_ACTIVE, USER_ROLE } from "./user.constant";

const authProviderSchema = new Schema<IAuthProvider>({
  provider: { type: String, enum: Object.values(USER_AUTH_PROVIDER), required: true },
  providerId: { type: String, required: true },
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: Object.values(USER_ROLE), default: USER_ROLE.USER },
    phone: { type: String, unique: true, sparse: true },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: String, enum: Object.values(USER_IS_ACTIVE), default: USER_IS_ACTIVE.ACTIVE },
    isVerified: { type: Boolean, default: false },
    auths: { type: [authProviderSchema], default: [] },
  },
  { timestamps: true, versionKey: false }
);

userSchema.set("toObject", {
  transform(doc, ret, _options) {
    delete ret.password;
    return ret;
  },
});

export const User = model<IUser>("User", userSchema);
