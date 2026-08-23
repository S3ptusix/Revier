import rateLimit from "express-rate-limit";

export const userRegisterLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many registration attempts. Please try again later.",
    },
});

export const userLoginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Please try again later.",
    },
});

export const userLoginAccountLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,

    keyGenerator: (req) => {
        return `login:${req.body.email}`;
    },

    message: {
        message: "Too many login attempts to this account. Please try again later.",
    },
});