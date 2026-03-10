import { adminRegistrationService, deleteAdminService, editAdminService, fetchAllAdminService, fetchOneAdminService, loginAdminService } from "../services/adminServices.js";
import { cookieOptions } from "../utils/cookie.js";

// REGISTER ADMIM
export const adminRegistrationController = async (req, res) => {
    try {
        const { fullname, email, role, assignedCompanies } = req.body;
        const result = await adminRegistrationService(fullname, email, role, assignedCompanies);

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
            return res.json({ success: false, message: result.message })
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
export const logoutAdminController = (req, res) => {
    res.clearCookie('adminToken', cookieOptions);
    return res.json({ success: true, message: 'Logged out successfully' });
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
        const result = await fetchAllAdminService(admin.id);

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
        const {
            fullname,
            email,
            role,
            assignedCompanies

        } = req.body;
        const result = await editAdminService(
            adminId,
            fullname,
            email,
            role,
            assignedCompanies
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
