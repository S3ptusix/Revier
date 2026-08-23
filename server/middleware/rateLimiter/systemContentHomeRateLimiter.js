import rateLimit from "express-rate-limit";

// PUBLIC - fetch/fetch/:section, unauthenticated homepage content
export const systemContentPublicLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});

// WRITE - hero/howItWorks/contact section updates
export const systemContentWriteLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});

// IMAGE UPLOAD - heavier operation, keep this tighter
export const systemContentImageUploadLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many image upload attempts. Please try again later.",
    },
});
