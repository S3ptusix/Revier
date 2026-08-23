import rateLimit from "express-rate-limit";

// GENERAL - dashboard summary/pipeline/interviews-today/upcoming-orientations
export const dashboardGeneralLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});
