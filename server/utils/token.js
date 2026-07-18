import jwt from 'jsonwebtoken';

export const createAdminToken = ({
    id,
    firstName,
    lastName,
    email,
    role
}) => {
    return jwt.sign(
        {
            id,
            firstName,
            lastName,
            email,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );
};

export const createUserToken = ({
    id,
    firstName,
    lastName,
    email,
}) => {
    return jwt.sign(
        {
            id,
            firstName,
            lastName,
            email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );
};