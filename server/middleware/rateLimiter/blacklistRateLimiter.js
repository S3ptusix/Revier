import rateLimit from "express-rate-limit";

// GENERAL - blacklist toggle / fetch reason
export const blacklistGeneralLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});
