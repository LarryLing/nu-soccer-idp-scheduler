import { z } from "zod";

export const SignInFormSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

export const ResetPasswordFormSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: "contain at least 8 characters" })
            .refine((password) => /[A-Z]/.test(password), {
                message: "contain at least one uppercase letter",
            })
            .refine((password) => /[a-z]/.test(password), {
                message: "contain at least one lowercase letter",
            })
            .refine((password) => /[0-9]/.test(password), {
                message: "contain at least one number",
            })
            .refine((password) => /[!@#$%^&*]/.test(password), {
                message: "contain at least one special character",
            }),
        confirmPassword: z.string().min(1, {
            message: "Password confirmation is required",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const ForgotPasswordFormSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

export const CreateAnAccountSchema = z
    .object({
        email: z.string().email({
            message: "Email is required",
        }),
        password: z
            .string()
            .min(8, { message: "contain at least 8 characters" })
            .refine((password) => /[A-Z]/.test(password), {
                message: "contain at least one uppercase letter",
            })
            .refine((password) => /[a-z]/.test(password), {
                message: "contain at least one lowercase letter",
            })
            .refine((password) => /[0-9]/.test(password), {
                message: "contain at least one number",
            })
            .refine((password) => /[!@#$%^&*]/.test(password), {
                message: "contain at least one special character",
            }),
        confirmPassword: z.string().min(1, {
            message: "Password confirmation is required",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
