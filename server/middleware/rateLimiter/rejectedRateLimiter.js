import rateLimit from "express-rate-limit";

// GENERAL - fetch all rejected
export const rejectedGeneralLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});
