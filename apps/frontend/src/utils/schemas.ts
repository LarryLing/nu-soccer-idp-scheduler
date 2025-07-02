import { z } from "zod";
import { validatePassword, validateTimeOrder } from "./helpers.ts";
import { DAYS, POSITIONS, TIME_MESSAGE, TIME_REGEX } from "./constants.ts";

const DaySchema = z.enum(DAYS);
const TimeSchema = z.string().regex(TIME_REGEX, { message: TIME_MESSAGE });
const EmailSchema = z.string().email({ message: "Email is required." });
const PasswordSchema = z
  .string()
  .min(8, { message: "Password must contain at least 8 characters." });
const StrongPasswordSchema = PasswordSchema.refine(
  (pwd) => validatePassword(pwd).hasUppercase,
  {
    message: "Password must contain at least one uppercase letter.",
  },
)
  .refine((pwd) => validatePassword(pwd).hasLowercase, {
    message: "Password must contain at least one lowercase letter.",
  })
  .refine((pwd) => validatePassword(pwd).hasNumber, {
    message: "Password must contain at least one number.",
  })
  .refine((pwd) => validatePassword(pwd).hasSpecial, {
    message: "Password must contain at least one special character.",
  });

export const SignInFormSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, { message: "Password is required." }),
});

export const ForgotPasswordFormSchema = z.object({
  email: EmailSchema,
});

export const ResetPasswordFormSchema = z
  .object({
    password: StrongPasswordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Password confirmation is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const CreateAnAccountSchema = z
  .object({
    email: EmailSchema,
    password: StrongPasswordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Password confirmation is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const AvailabilitySchema = z
  .object({
    day: DaySchema,
    start: TimeSchema,
    end: TimeSchema,
  })
  .refine(validateTimeOrder, {
    message: "End time must be after start time.",
    path: ["end"],
  });

export const TrainingBlockSchema = z
  .object({
    day: DaySchema,
    start: TimeSchema,
    end: TimeSchema,
  })
  .refine(validateTimeOrder, {
    message: "End time must be after start time.",
    path: ["end"],
  });

export const PlayerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[A-Za-z]+(?:[ '-.][A-Za-z]+)*$/, {
      message: "Name cannot contain special characters.",
    }),
  number: z
    .number({ message: "Number is required" })
    .min(0, { message: "Number must be greater than or equal to 0." })
    .max(99, { message: "Number must be less than or equal to 99." }),
  position: z.enum(POSITIONS),
  availabilities: AvailabilitySchema.array(),
});
