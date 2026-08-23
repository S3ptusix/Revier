import rateLimit from "express-rate-limit";

// GENERAL - fetch all hired
export const hiredGeneralLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});
