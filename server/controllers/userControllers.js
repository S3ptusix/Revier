import { userLoginService, userRegistrationService } from "../services/userServices.js";
import { cookieOptions } from "../utils/cookie.js";

// REGISTER USER 
export const userRegistrationController = async (req, res) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;
        const result = await userRegistrationService(fullname, email, password, confirmPassword);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// LOGIN USER
export const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userLoginService(email, password);

        if (!result.success) {
            return res.json(result)
        }

        res.cookie('userToken', result.token, cookieOptions);

        return res.json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH USER
export const fetchUserController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.json({
                success: false,
                user: null
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            user: null,
            message: error.message
        });
    }
};

// LOGOUT USER
export const logoutUserController = (req, res) => {
    res.clearCookie('userToken', cookieOptions);
    return res.json({ success: true, message: 'Logged out successfully' });
};