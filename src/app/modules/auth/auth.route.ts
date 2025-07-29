import passport from "passport";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.post(
  "/register",
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);
router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);
router.post(
  "/change-password",
  validateRequest(AuthValidation.changePasswordValidationSchema),
  auth(...Object.values(USER_ROLE)),
  AuthController.changePassword
);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logOutUser);

router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
  const redirectUrl = (req.query.redirect as string) || "";
  passport.authenticate("google", { scope: ["profile", "email"], state: redirectUrl })(
    req,
    res,
    next
  );
});
router.get(
  "/callback/google",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthController.passportCallback
);

router.get("/facebook", async (req: Request, res: Response, next: NextFunction) => {
  const redirectUrl = (req.query.redirect as string) || "";
  passport.authenticate("facebook", { state: redirectUrl })(req, res, next);
});
router.get(
  "/callback/facebook",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  AuthController.passportCallback
);

export const AuthRoutes = router;
