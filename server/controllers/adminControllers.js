import AdminLog from "../models/AdminLog.js";
import { adminRegistrationService, changePasswordService, deleteAdminService, editAdminService, editProfileService, fetchAdminTotalService, fetchAllAdminlogService, fetchAllAdminService, fetchOneAdminService, loginAdminService } from "../services/adminServices.js";
import { cookieOptions } from "../utils/cookie.js";

// REGISTER ADMIM
export const adminRegistrationController = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            sex,
            email,
            role,
            holdCompanies
        } = req.body;
        const result = await adminRegistrationService(
            firstName,
            lastName,
            sex,
            email,
            role,
            holdCompanies
        );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// LOGIN ADMIN
export const loginAdminController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginAdminService(email, password);
        if (!result.success) {
            return res.json({ success: false, message: result.message, isVerified: result.isVerified })
        }
        res.cookie('adminToken', result.token, cookieOptions);

        return res.json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: "Server error"
        });
    }
};

// LOGOUT ADMIN
export const logoutAdminController = async (req, res) => {
    try {
        if (!req.admin) {
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        res.clearCookie('adminToken', cookieOptions);

        await AdminLog.create({
            adminId: req.admin.id,
            logStatus: 'logout'
        });

        return res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// FETCH ADMIN
export const fetchAdminController = async (req, res) => {
    try {
        const admin = req.admin;
        if (!admin) {
            return res.json({
                success: false,
                admin: null
            });
        }

        return res.json({
            success: true,
            admin
        });

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            admin: null,
            message: "Server error"
        });
    }
};

// FETCH ONE ADMIN
export const fetchOneAdminController = async (req, res) => {
    try {
        const { adminId } = req.params;
        const result = await fetchOneAdminService(adminId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL ADMIN
export const fetchAllAdminController = async (req, res) => {
    try {
        const admin = req.admin;
        const { search, role, page } = req.query;
        const result = await fetchAllAdminService(admin.id, search, role, page);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// DELETE ADMIN
export const deleteAdminController = async (req, res) => {
    try {
        const { adminId } = req.params;
        const result = await deleteAdminService(adminId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// EDIT ADMIM
export const editAdminController = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { role, holdCompanies } = req.body;
        const result = await editAdminService(
            adminId,
            role,
            holdCompanies
        );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ADMIN TOTAL
export const fetchAdminTotalController = async (req, res) => {
    try {
        const result = await fetchAdminTotalService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// EDIT PROFILE
export const editProfileController = async (req, res) => {
    try {
        const admin = req.admin;
        const { firstName, lastName } = req.body;

        const result = await editProfileService(admin.id, firstName, lastName);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// CHANGE PASSWORD
export const changePasswordController = async (req, res) => {
    try {
        const admin = req.admin;
        const {
            password,
            confirmPassword,
        } = req.body;

        const result = await changePasswordService
            (
                admin.id,
                password,
                confirmPassword,
            );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL ADMIN LOG
export const fetchAllAdminLogController = async (req, res) => {
    try {
        const admin = req.admin;
        const { page } = req.query;
        const result = await fetchAllAdminlogService(admin.id, page);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}