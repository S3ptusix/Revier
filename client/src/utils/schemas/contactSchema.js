import { z } from "zod";

export const contactSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required"),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required"),

    to_email: z
        .string()
        .trim()
        .email("Please enter a valid email address"),

    phone: z
        .string()
        .trim()
        .regex(
            /^09\d{9}$/,
            "Please enter a valid Philippine mobile number"
        ),

    message: z
        .string()
        .trim()
        .min(1, "Message is required"),
});