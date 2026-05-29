import Admins from '../models/Admin.js';
import { removeUnnecessarySpaces, capitalizeEachWord } from '../utils/format.js';
import { isArrayofNumbers, validAdminRole, validateEmail } from '../utils/inputValidators.js';
import bcrypt from 'bcrypt';
import { createAdminToken } from '../utils/token.js';
import { Op, fn, col, where } from "sequelize";
import crypto from 'crypto';
import { sendMail } from '../utils/mailer.js';
import AdminLog from '../models/AdminLog.js';

// REGISTER ADMIN
export const adminRegistrationService = async (
    firstName,
    lastName,
    sex,
    email,
    role
) => {
    try {
        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !sex.trim() ||
            !email.trim() ||
            !role.trim()
        ) {

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

        const hashedPassword = await bcrypt.hash('Password@123', 10);

        // Optional: generate OTP and expiration
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        const formattedFirstName = capitalizeEachWord(
            removeUnnecessarySpaces(firstName)
        );

        const formattedLastName = capitalizeEachWord(
            removeUnnecessarySpaces(lastName)
        );

        if (formattedFirstName.length < 4 || formattedLastName.length < 4) return { success: false, message: "First name and Last name must be atleast 4 characters long." };

        const newAdmin = await Admins.create({
            firstName: formattedFirstName,
            lastName: formattedLastName,
            sex,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpireAt
        });

        sendMail({
            to: email,
            subject: 'Your One-Time Password (OTP)',
            html: `
                <div style="background-color:#f0fdf4; padding:40px 0; font-family:Arial, sans-serif;">
                    <div style="
                        max-width:520px;
                        margin:0 auto;
                        background:#ffffff;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 10px 25px rgba(0,0,0,0.08);
                    ">
                        
                        <!-- Header -->
                        <div style="background-color:#10b981; padding:20px 24px;">
                        <h1 style="
                            margin:0;
                            color:#ffffff;
                            font-size:22px;
                            font-weight:700;
                            text-align:center;
                        ">
                            REVIER Security Code
                        </h1>
                        </div>

                        <!-- Body -->
                        <div style="padding:28px 24px; color:#333;">
                        <p style="margin-top:0;">Hi there 👋</p>

                        <p>
                            We received a request to access your account.  
                            Please use the One-Time Password (OTP) below:
                        </p>

                        <!-- OTP Box -->
                        <div style="
                            margin:24px 0;
                            padding:16px;
                            text-align:center;
                            border-radius:10px;
                            background-color:#ecfdf5;
                            border:2px dashed #10b981;
                        ">
                            <span style="
                            font-size:28px;
                            letter-spacing:6px;
                            font-weight:700;
                            color:#10b981;
                            ">
                            ${otp}
                            </span>
                        </div>

                        <p>
                            This code is valid for a limited time.  
                            <strong>Do not share this OTP with anyone.</strong>
                        </p>

                        <p style="color:#555;">
                            If you didn’t request this, you can safely ignore this email.
                        </p>

                        <p style="margin-bottom:0;">
                            Thanks,<br/>
                            <strong>REVIER Team</strong>
                        </p>
                        </div>

                        <!-- Footer -->
                        <div style="
                        padding:16px;
                        text-align:center;
                        font-size:12px;
                        color:#6b7280;
                        background:#f9fafb;
                        ">
                        © ${new Date().getFullYear()} REVIER. All rights reserved.
                        </div>

                    </div>
                </div>
            `
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

        if (admin.isVerified === 'no') {

            const otp = crypto.randomInt(100000, 999999).toString();
            const otpExpireAt = new Date(Date.now() + 5 * 60 * 1000);

            await admin.update({
                otp,
                otpExpireAt
            });

            sendMail({
                to: email,
                subject: 'Your One-Time Password (OTP)',
                html: `
                    <div style="background-color:#f0fdf4; padding:40px 0; font-family:Arial, sans-serif;">
                        <div style="
                            max-width:520px;
                            margin:0 auto;
                            background:#ffffff;
                            border-radius:12px;
                            overflow:hidden;
                            box-shadow:0 10px 25px rgba(0,0,0,0.08);
                        ">
                            
                            <!-- Header -->
                            <div style="background-color:#10b981; padding:20px 24px;">
                            <h1 style="
                                margin:0;
                                color:#ffffff;
                                font-size:22px;
                                font-weight:700;
                                text-align:center;
                            ">
                                REVIER Security Code
                            </h1>
                            </div>

                            <!-- Body -->
                            <div style="padding:28px 24px; color:#333;">
                            <p style="margin-top:0;">Hi there 👋</p>

                            <p>
                                We received a request to access your account.  
                                Please use the One-Time Password (OTP) below:
                            </p>

                            <!-- OTP Box -->
                            <div style="
                                margin:24px 0;
                                padding:16px;
                                text-align:center;
                                border-radius:10px;
                                background-color:#ecfdf5;
                                border:2px dashed #10b981;
                            ">
                                <span style="
                                font-size:28px;
                                letter-spacing:6px;
                                font-weight:700;
                                color:#10b981;
                                ">
                                ${otp}
                                </span>
                            </div>

                            <p>
                                This code is valid for a limited time.  
                                <strong>Do not share this OTP with anyone.</strong>
                            </p>

                            <p style="color:#555;">
                                If you didn’t request this, you can safely ignore this email.
                            </p>

                            <p style="margin-bottom:0;">
                                Thanks,<br/>
                                <strong>REVIER Team</strong>
                            </p>
                            </div>

                            <!-- Footer -->
                            <div style="
                            padding:16px;
                            text-align:center;
                            font-size:12px;
                            color:#6b7280;
                            background:#f9fafb;
                            ">
                            © ${new Date().getFullYear()} REVIER. All rights reserved.
                            </div>

                        </div>
                    </div>
                `
            });
            return { success: false, message: "Admin not verified.", isVerified: false };
        }

        const token = createAdminToken({
            id: admin.id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role
        });

        await AdminLog.create({
            adminId: admin.id,
            logStatus: 'login'
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
                "firstName",
                "lastName",
                "sex",
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
export const fetchAllAdminService = async (
    adminId,
    search = "",
    role = "",
    page = 1,
    limit = 10
) => {
    try {
        const offset = (page - 1) * limit;

        const whereClause = {
            id: { [Op.ne]: adminId },
            [Op.and]: []
        };

        // ✅ ROLE FILTER
        if (role) {
            whereClause[Op.and].push({ role });
        }

        // ✅ SEARCH (FULL NAME + OTHER FIELDS)
        if (search) {
            whereClause[Op.and].push({
                [Op.or]: [
                    // 🔥 FULL NAME SEARCH
                    where(
                        fn("concat", col("firstName"), " ", col("lastName")),
                        { [Op.like]: `%${search}%` }
                    ),

                    { email: { [Op.like]: `%${search}%` } },
                    { sex: { [Op.like]: `%${search}%` } },
                    { role: { [Op.like]: `%${search}%` } },
                ],
            });
        }

        // 🧹 Clean empty AND
        if (whereClause[Op.and].length === 0) {
            delete whereClause[Op.and];
        }

        const total = await Admins.count({ where: whereClause });

        const admins = await Admins.findAll({
            where: whereClause,
            attributes: [
                "id",
                "firstName",
                "lastName",
                "sex",
                "email",
                "role"
            ],

            // 🔥 ORDER BY FULL NAME
            order: [
                [fn("concat", col("firstName"), " ", col("lastName")), "ASC"]
            ],

            limit,
            offset,
        });

        return {
            success: true,
            admins,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
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

// EDIT PROFILE
export const editProfileService = async (adminId, firstName, lastName) => {
    try {
        if (
            isNaN(adminId) ||
            !firstName.trim() ||
            !lastName.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        const formattedFirstName = capitalizeEachWord(
            removeUnnecessarySpaces(firstName)
        );

        const formattedLastName = capitalizeEachWord(
            removeUnnecessarySpaces(lastName)
        );

        if (formattedFirstName.length < 4 || formattedLastName.length < 4) return { success: false, message: "First name and Last name must be atleast 4 characters long." };

        await Admins.update({
            firstName: formattedFirstName,
            lastName: formattedLastName
        }, {
            where: { id: adminId }
        });

        return {
            success: true,
            message: "Profile updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// CHANGE PASSWORD
export const changePasswordService = async (
    adminId,
    password,
    confirmPassword,
) => {
    try {
        if (
            isNaN(adminId) ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return {
                success: false,
                message: "Admin not found."
            };
        }

        if (password !== confirmPassword) {
            return {
                success: false,
                message: 'Password does not match.'
            };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        await Admins.update(
            { password: hashedPassword },
            { where: { id: adminId } }
        );

        return {
            success: true,
            message: "Change password successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// FETCH ALL ADMIN LOG
export const fetchAllAdminlogService = async (
    adminId,
    page = 1,
    limit = 20
) => {
    try {
        const offset = (page - 1) * limit;

        const total = await AdminLog.count({ where: adminId });

        const data = await AdminLog.findAll({
            where: adminId,
            attributes: [
                "adminId",
                "logStatus",
                "createdAt",
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        });

        return {
            success: true,
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};