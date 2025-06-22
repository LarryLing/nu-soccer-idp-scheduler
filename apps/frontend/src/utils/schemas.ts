import { z } from "zod";

export const SignInFormSchema = z.object({
    email: z.string().email({
        message: "Email is required.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export const ResetPasswordFormSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: "contain at least 8 characters." })
            .refine((password) => /[A-Z]/.test(password), {
                message: "contain at least one uppercase letter.",
            })
            .refine((password) => /[a-z]/.test(password), {
                message: "contain at least one lowercase letter.",
            })
            .refine((password) => /[0-9]/.test(password), {
                message: "contain at least one number.",
            })
            .refine((password) => /[!@#$%^&*]/.test(password), {
                message: "contain at least one special character.",
            }),
        confirmPassword: z.string().min(1, {
            message: "Password confirmation is required.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export const ForgotPasswordFormSchema = z.object({
    email: z.string().email({
        message: "Email is required.",
    }),
});

export const CreateAnAccountSchema = z
    .object({
        email: z.string().email({
            message: "Email is required.",
        }),
        password: z
            .string()
            .min(8, { message: "contain at least 8 characters." })
            .refine((password) => /[A-Z]/.test(password), {
                message: "contain at least one uppercase letter.",
            })
            .refine((password) => /[a-z]/.test(password), {
                message: "contain at least one lowercase letter.",
            })
            .refine((password) => /[0-9]/.test(password), {
                message: "contain at least one number.",
            })
            .refine((password) => /[!@#$%^&*]/.test(password), {
                message: "contain at least one special character.",
            }),
        confirmPassword: z.string().min(1, {
            message: "Password confirmation is required.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export const AvailabilitySchema = z
    .object({
        day: z.enum([
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]),
        start: z
            .string()
            .min(1, {
                message: "Start time is required",
            })
            .regex(/^(1[0-2]|0?[1-9]):([0-5][0-9])([AP]M)$/, {
                message: "Start time must be in format '9:30AM' or '12:45PM'.",
            }),
        end: z
            .string()
            .min(1, {
                message: "End time is required",
            })
            .regex(/^(1[0-2]|0?[1-9]):([0-5][0-9])([AP]M)$/, {
                message: "End time must be in format '9:30AM' or '12:45PM'.",
            }),
    })
    .refine(
        (data) => {
            const parseTime = (timeStr: string) => {
                const [hours, minutes] = timeStr
                    .slice(0, -2)
                    .split(":")
                    .map(Number);
                const period = timeStr.slice(-2).toUpperCase();
                const totalHours = (hours % 12) + (period === "PM" ? 12 : 0);
                return totalHours * 60 + minutes;
            };
            return parseTime(data.end) > parseTime(data.start);
        },
        {
            message: "End time must be after start time.",
            path: ["end"],
        },
    );

export const PlayerSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Name is required",
        })
        .regex(/^[A-Za-z]+(?:[ '-.][A-Za-z]+)*$/, {
            message: "Name cannot contain special characters.",
        }),
    number: z
        .number({ message: "Number is required" })
        .min(0, {
            message: "Number must be greater than or equal to 0.",
        })
        .max(99, {
            message: "Number must be less than or equal to 99.",
        }),
    position: z.enum(["Goalkeeper", "Defender", "Midfielder", "Forward"]),
    availabilities: z.array(AvailabilitySchema),
});

export const TrainingBlockSchema = z.object({
    day: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]),
    start: z.string().regex(/^(1[0-2]|0?[1-9]):([0-5][0-9])([AP]M)$/, {
        message: "Start time must be in format '9:30AM' or '12:45PM'.",
    }),
    end: z.string().regex(/^(1[0-2]|0?[1-9]):([0-5][0-9])([AP]M)$/, {
        message: "End time must be in format '9:30AM' or '12:45PM'.",
    }),
});
