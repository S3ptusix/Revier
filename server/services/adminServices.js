import Admins from '../models/Admin.js';
import { removeUnnecessarySpaces, capitalizeEachWord } from '../utils/format.js';
import { isArrayofNumbers, validAdminRole, validateEmail } from '../utils/inputValidators.js';
import bcrypt from 'bcrypt';
import { createAdminToken } from '../utils/token.js';

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