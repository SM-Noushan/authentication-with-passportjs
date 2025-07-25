import status from "http-status";
import AppError from "../../errors/AppError";
import { AuthServices } from "./auth.service";
import { setAuthCookies } from "./auth.utils";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const registerUser = catchAsync(async (req, res) => {
  const { result, tokenInfo } = await AuthServices.registerUser(req.body);

  setAuthCookies(res, tokenInfo);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { result, tokenInfo } = await AuthServices.loginUser(req.body);

  setAuthCookies(res, tokenInfo);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  await AuthServices.changePassword(req.user.userId, req.body.newPassword, req.body.oldPassword);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password changed successfully",
    data: null,
  });
});

const getNewAccessToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new AppError(status.UNAUTHORIZED, "Refresh token not found in cookies");

  const result = await AuthServices.getNewAccessToken(refreshToken);

  setAuthCookies(res, result);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "New access token generated successfully",
    data: result,
  });
});

const logOutUser = catchAsync(async (req, res) => {
  ["accessToken", "refreshToken"].forEach(key =>
    res.clearCookie(key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  changePassword,
  getNewAccessToken,
  logOutUser,
};
