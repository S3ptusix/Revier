import rateLimit from "express-rate-limit";

// APPLICANT DETAILS - unauthenticated endpoint, protect against scraping/enumeration
export const applicantDetailsLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});

// GENERAL - status history / totals (authenticated)
export const applicantGeneralLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});
