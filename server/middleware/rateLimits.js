import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false
});
