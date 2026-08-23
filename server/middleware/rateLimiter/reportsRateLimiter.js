import rateLimit from "express-rate-limit";

// GENERAL - reports are typically heavier aggregate queries, keep this tighter
export const reportsGeneralLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});
