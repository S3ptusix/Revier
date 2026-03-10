import Admins from '../models/Admin.js';
import { removeUnnecessarySpaces, capitalizeEachWord } from '../utils/format.js';
import { isArrayofNumbers, validAdminRole, validateEmail } from '../utils/inputValidators.js';
import bcrypt from 'bcrypt';
import { createAdminToken } from '../utils/token.js';
import { Op } from 'sequelize';
import Companies from '../models/Company.js';

// REGISTER ADMIN
export const adminRegistrationService = async (
    fullname,
    email,
    role,
    assignedCompanies = []
) => {
    try {
        // Required fields
        if (!fullname.trim() || !email.trim() || !role.trim() || assignedCompanies === undefined) {

            return {
                success: false,
                message: "Please complete all fields to proceed with account creation."
            };
        }

        // Normalize email
        email = email.toLowerCase().trim();

        // Email validation
        if (!validateEmail(email)) {
            return { success: false, message: "Invalid email format." };
        }

        // Check existing email
        const existingEmail = await Admins.findOne({ where: { email } });
        if (existingEmail) {
            return { success: false, message: "This email is already registered." };
        }

        // Role validation
        if (!validAdminRole(role)) {
            return { success: false, message: "Invalid role." };
        }

        // Assigned companies validation
        const invalidCompaniesMsg = "Invalid input on assigned companies.";

        // Must be an array; empty array is allowed
        if (!Array.isArray(assignedCompanies)) {
            return { success: false, message: invalidCompaniesMsg };
        }

        // If array has items, validate they are numbers
        if (assignedCompanies.length > 0 && !isArrayofNumbers(assignedCompanies)) {
            return { success: false, message: invalidCompaniesMsg };
        }

        // Format fullname
        const formattedFullname = capitalizeEachWord(
            removeUnnecessarySpaces(fullname)
        );

        // Default password (consider moving to .env)
        const hashedPassword = await bcrypt.hash('Revier@123', 10);

        // Create admin
        const newAdmin = await Admins.create({
            fullname: formattedFullname,
            email,
            password: hashedPassword,
            role,
            assignedCompanies
        });

        console.log('Admin added to DB:', newAdmin.email);

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
                "role",
                "assignedCompanies"
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
export const fetchAllAdminService = async (adminId) => {
    try {
        const admins = await Admins.findAll({
            where: {
                id: {
                    [Op.ne]: adminId
                },
            },
            attributes: [
                "id",
                "fullname",
                "email",
                "role",
                "assignedCompanies"
            ],
            order: [["fullname", "ASC"]],
        });

        // Get all unique company IDs
        const companyIds = [
            ...new Set(
                admins.flatMap(admin => admin.assignedCompanies || [])
            )
        ];

        // Fetch companies
        const companies = await Companies.findAll({
            where: { id: companyIds },
            attributes: ["id", "companyName"]
        });

        const companyMap = {};
        companies.forEach(c => {
            companyMap[c.id] = c.companyName;
        });

        // Attach company names
        const result = admins.map(admin => ({
            ...admin.toJSON(),
            companies: admin.assignedCompanies.map(id => ({
                id,
                companyName: companyMap[id] || null
            }))
        }));

        return {
            success: true,
            admins: result,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
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
    fullname,
    email,
    role,
    assignedCompanies

) => {
    try {
        if (
            isNaN(adminId) ||
            !fullname.trim() ||
            !email.trim() ||
            !role.trim() ||
            !Array.isArray(assignedCompanies)
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        // Create user
        await Admins.update({
            fullname,
            email,
            role,
            assignedCompanies
        }, {
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
