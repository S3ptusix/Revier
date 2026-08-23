import rateLimit from "express-rate-limit";

// LOGIN - per IP
export const adminLoginLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many login attempts. Please try again later.",
    },
});

// LOGIN - per account, prevents targeted brute force on one email
export const adminLoginAccountLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,

    keyGenerator: (req) => {
        return `admin-login:${req.body.email}`;
    },

    message: {
        message: "Too many login attempts to this account. Please try again later.",
    },
});

// REGISTER ADMIN
export const adminRegisterLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many registration attempts. Please try again later.",
    },
});

// CHANGE PASSWORD
export const adminChangePasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many password change attempts. Please try again later.",
    },
});

// GENERAL - fetch/edit/delete/logout/etc.
export const adminGeneralLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later.",
    },
});
