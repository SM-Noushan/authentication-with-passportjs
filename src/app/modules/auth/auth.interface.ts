export type TLoginUser = {
  email: string;
  password: string;
};

export type TRegisterUser = TLoginUser & {
  name: string;
  phone?: string;
  address?: string;
};

export type TPasswordChange = {
  currentPassword: string;
  newPassword: string;
};

export interface IAuthTokens {
  accessToken?: string;
  refreshToken?: string;
}
