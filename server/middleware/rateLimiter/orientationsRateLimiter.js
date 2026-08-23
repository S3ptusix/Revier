import rateLimit from "express-rate-limit";

// WRITE - create/edit/delete/removeFromEvent/changeEvent/addToEvent/status
export const orientationWriteLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});

// BULK - bulkMoveToEvent/bulkRemoveFromEvent/bulkEditOrientationStatus
export const orientationBulkLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many bulk requests. Please try again later.",
    },
});

// GENERAL - fetch endpoints/totals
export const orientationGeneralLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});
