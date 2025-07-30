import passport from "passport";
import status from "http-status";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { AuthServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createUserTokens, setAuthCookies } from "./auth.utils";

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

// const loginUser = catchAsync(async (req, res) => {
//   const { result, tokenInfo } = await AuthServices.loginUser(req.body);

//   setAuthCookies(res, tokenInfo);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: "User logged in successfully",
//     data: result,
//   });
// });
const loginUser = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport.authenticate("local", async (err: any, user: any, info: { message: string }) => {
    // console.log({ err, user, info });
    if (err) return next(err);
    // return next(new AppError(status.UNAUTHORIZED, err));
    if (!user) return next(new AppError(status.UNAUTHORIZED, info.message));

    const tokenInfo = createUserTokens(user);
    setAuthCookies(res, tokenInfo);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        user,
        ...tokenInfo,
      },
    });
  })(req, res, next);
});

const changePassword = catchAsync(async (req, res) => {
  await AuthServices.changePassword(
    (req.user as JwtPayload).userId,
    req.body.newPassword,
    req.body.oldPassword
  );

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

const passportCallback = catchAsync(async (req, res) => {
  let redirectTo = (req.query.state as string) || "";
  if (redirectTo && !redirectTo.startsWith("/")) redirectTo = "/" + redirectTo;
  // console.log("Passport Callback Redirect To:", redirectTo);

  const user = req.user;
  if (!user) throw new AppError(status.NOT_FOUND, "Passport authentication failed");
  // console.log("Passport Callback User:", user);
  const tokenInfo = createUserTokens(user);

  setAuthCookies(res, tokenInfo);
  // console.log("Redirecting to:", config.FRONTEND_URL + redirectTo);
  res.redirect(config.FRONTEND_URL + redirectTo);
});

export const AuthController = {
  registerUser,
  loginUser,
  changePassword,
  getNewAccessToken,
  logOutUser,
  passportCallback,
};
