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
            expiresIn: "1d"
        }
    );
};

export const createUserToken = ({
    id,
    firstName,
    lastName
}) => {
    return jwt.sign(
        {
            id,
            firstName,
            lastName
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};
