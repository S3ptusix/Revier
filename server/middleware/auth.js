import jwt from 'jsonwebtoken';

export const authenticateAdminJWT = (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) return res.json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.json({ message: 'Invalid token' });
    }
};

export const authenticateUserJWT = (req, res, next) => {
    const token = req.cookies.userToken;
    if (!token) return res.json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.json({ message: 'Invalid token' });
    }
};


export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
        return res.json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
};
