import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

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
router.post("/logout", AuthController.logOutUser);

export const AuthRoutes = router;
