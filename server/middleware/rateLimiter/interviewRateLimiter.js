import rateLimit from "express-rate-limit";

// WRITE - reschedule/failed/forOrientation
export const interviewWriteLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});

// BULK - bulkForOrientation/bulkFailedInterview
export const interviewBulkLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many bulk requests. Please try again later.",
    },
});

// GENERAL - fetchAll/fetchOne
export const interviewGeneralLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});
