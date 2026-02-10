import jwt from 'jsonwebtoken';

export const createAdminToken = ({ id, fullname, email, role }) => {
    return jwt.sign(
        { id, fullname, email, role },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

export const createUserToken = ({ id, fullname }) => {
    return jwt.sign(
        { id, fullname },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};
