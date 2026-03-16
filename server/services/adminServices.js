import Admins from '../models/Admin.js';
import { removeUnnecessarySpaces, capitalizeEachWord } from '../utils/format.js';
import { isArrayofNumbers, validAdminRole, validateEmail } from '../utils/inputValidators.js';
import bcrypt from 'bcrypt';
import { createAdminToken } from '../utils/token.js';
import { Op } from 'sequelize';

// REGISTER ADMIN
export const adminRegistrationService = async (
    fullname,
    email,
    role,
    assignedCompanies = []
) => {
    try {
        if (!fullname.trim() || !email.trim() || !role.trim() || assignedCompanies === undefined) {

            return {
                success: false,
                message: "Please complete all fields to proceed with account creation."
            };
        }

        email = email.toLowerCase().trim();

        if (!validateEmail(email)) {
            return { success: false, message: "Invalid email format." };
        }

        const existingEmail = await Admins.findOne({
            where: { email },
            paranoid: false // include soft-deleted rows
        });

        if (existingEmail) {
            return { success: false, message: "This email is already registered." };
        }

        if (!validAdminRole(role)) {
            return { success: false, message: "Invalid role." };
        }

        const invalidCompaniesMsg = "Invalid input on assigned companies.";

        if (!Array.isArray(assignedCompanies)) {
            return { success: false, message: invalidCompaniesMsg };
        }

        if (assignedCompanies.length > 0 && !isArrayofNumbers(assignedCompanies)) {
            return { success: false, message: invalidCompaniesMsg };
        }

        const formattedFullname = capitalizeEachWord(
            removeUnnecessarySpaces(fullname)
        );

        const hashedPassword = await bcrypt.hash('Revier@123', 10);

        const newAdmin = await Admins.create({
            fullname: formattedFullname,
            email,
            password: hashedPassword,
            role,
            assignedCompanies
        });

        return {
            success: true,
            message: 'Admin registered successfully'
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        }
    }
};

// LOGIN ADMIN
export const loginAdminService = async (email, password) => {
    try {
        if (!email.trim() || !password.trim()) {
            return { success: false, message: "Please complete all fields" };
        }

        const admin = await Admins.findOne({ where: { email } });

        if (!admin) return { success: false, message: "Wrong email or password!" };


        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return { success: false, message: "Wrong email or password!" };

        const token = createAdminToken({
            id: admin.id,
            fullname: admin.fullname,
            email: admin.email,
            role: admin.role
        });

        return {
            success: true,
            token
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message

        };
    }
};

// FETCH ONE ADMIN
export const fetchOneAdminService = async (adminId) => {
    try {
        const admin = await Admins.findByPk(adminId, {
            attributes: [
                "fullname",
                "email",
                "role"
            ]
        });

        return {
            success: true,
            admin,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// FETCH ALL ADMIN
export const fetchAllAdminService = async (adminId, role) => {
    try {
        const whereClause = {
            id: { [Op.ne]: adminId }
        };

        if (role) {
            whereClause.role = role;
        }

        const admins = await Admins.findAll({
            where: whereClause,
            attributes: ["id", "fullname", "email", "role"],
            order: [["fullname", "ASC"]],
        });

        return {
            success: true,
            admins
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};

// DELETE ADMIN 
export const deleteAdminService = async (adminId) => {
    try {
        const affectedRows = await Admins.destroy({
            where: { id: adminId }
        });
        if (affectedRows === 0) {
            return {
                success: false,
                message: 'Admin not found'
            };
        }

        return {
            success: true,
            message: 'Admin deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// EDIT ADMIN
export const editAdminService = async (
    adminId,
    role

) => {
    try {
        if (
            isNaN(adminId) ||
            !role.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        // Create user
        await Admins.update({ role }, {
            where: { id: adminId }
        });

        return {
            success: true,
            message: "Admin updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FETCH ADMIN TOTALS
export const fetchAdminTotalService = async () => {
    try {

        let totals = {
            totalAdmins: 0,
            hrManagers: 0,
            hrAssociates: 0
        };

        totals.totalAdmins = await Admins.count();

        totals.hrManagers = await Admins.count({
            where: {
                role: 'HR Manager'
            }
        });

        totals.hrAssociates = await Admins.count({
            where: {
                role: 'HR Associate'
            }
        });

        return {
            success: true,
            totals,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};