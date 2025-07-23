import { z } from "zod";

export const emailString = z
  .email()
  .min(6, { error: "Email must be at least 6 characters long." })
  .max(100, { error: "Email cannot exceed 100 characters." });

export const passwordString = z
  .string({
    error: issue =>
      issue.input === undefined ? "Password is required" : "Password must be string",
  })
  .min(8, { error: "Password must be at least 8 characters long." })
  .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)/, {
    error:
      "Password must contain at least 1 uppercase letter, 1 special character (!@#$%^&*), and 1 number.",
  });

const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters"),
    email: emailString,
    // password:passwordString,
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phone: z
      .string()
      .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
      })
      .optional(),
    address: z.string().max(200, { error: "Address cannot exceed 200 characters." }).optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: emailString,
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6, "Password must be at least 6 characters long"),
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
};
