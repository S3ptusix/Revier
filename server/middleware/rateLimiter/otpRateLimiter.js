import rateLimit from "express-rate-limit";

// SEND OTP - prevents SMS/email bombing of a target
export const sendOtpLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many OTP requests. Please wait before requesting another code.",
    },
});

// VERIFY OTP - prevents brute-forcing the OTP code
export const verifyOtpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many OTP verification attempts. Please try again later.",
    },
});
