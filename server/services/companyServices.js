import Admins from "../models/Admin.js";
import { Companies, Jobs } from '../models/index.js'
import { industries } from "../utils/data.js";
import { removeUnnecessarySpaces } from "../utils/format.js";
import { Sequelize } from "sequelize";

// CREATE COMPANY
export const createCompanyService = async (
    companyName,
    industry,
    location,
) => {
    try {
        // Required fields
        if (!companyName.trim() || !industry.trim() || !location.trim()) {

            return {
                success: false,
                message: "Please complete all fields to proceed with company creation."
            };
        }

        // Industry validation
        if (!industries.some(i => i.value === industry)) {
            return { success: false, message: "Invalid industry." };
        }

        // Format inputs
        const formattedCompanyName = removeUnnecessarySpaces(companyName);
        const formattedLocation = removeUnnecessarySpaces(location);

        // Create company
        await Companies.create({
            companyName: formattedCompanyName,
            industry,
            location: formattedLocation
        });

        return {
            success: true,
            message: 'Company created successfully'
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        }
    }
};

// FETCH ALL SELECT COMPANY
export const fetchAllCompanySelectService = async (adminId) => {
    try {
        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        let companies;

        if (admin.role === "HR Manager") {
            companies = await Companies.findAll({
                attributes: ["id", "companyName"],
                order: [["companyName", "ASC"]],
            });
        } else {
            companies = await Companies.findAll({
                where: {
                    id: admin.assignedCompanies,
                },
                attributes: ["id", "companyName"],
                order: [["companyName", "ASC"]],
            });
        }

        return {
            success: true,
            companies,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// FETCH ALL COMPANY
export const fetchAllCompanyService = async (adminId) => {
    try {
        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        let companies;

        if (admin.role === "HR Manager") {
            companies = await Companies.findAll({
                attributes: [
                    "id",
                    "companyName",
                    "industry",
                    "location",
                    "status",
                    [Sequelize.fn("COUNT", Sequelize.col("jobs.id")), "jobCount"]
                ],
                include: [
                    {
                        model: Jobs,
                        as: "jobs",
                        attributes: []
                    }
                ],
                group: ["company.id"],
                order: [["companyName", "ASC"]],
            });
        } else {
            companies = await Companies.findAll({
                where: {
                    id: admin.assignedCompanies,
                },
                attributes: [
                    "id",
                    "companyName",
                    "industry",
                    "location",
                    "status",
                    [Sequelize.fn("COUNT", Sequelize.col("jobs.id")), "jobCount"]
                ],
                include: [
                    {
                        model: Jobs,
                        as: "jobs",
                        attributes: []
                    }
                ],
                order: [["companyName", "ASC"]],
            });
        }

        return {
            success: true,
            companies,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// FETCH ONE COMPANY
export const fetchOneCompanyService = async (adminId, companyId) => {
    try {
        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        const company = await Companies.findByPk(companyId, {
            attributes: [
                'companyName',
                'industry',
                'location',
                'status'
            ]
        });

        return {
            success: true,
            company
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// UPDATE COMPANY
export const updateCompanyService = async (
    companyId,
    companyName,
    industry,
    location

) => {
    try {

        if (
            !companyName.trim() ||
            !industry.trim() ||
            !location.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        await Companies.update({
            companyName,
            industry,
            location
        }, {
            where: { id: companyId }
        });

        return {
            success: true,
            message: "Company updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// DELETE COMPANY 
export const deleteCompanyService = async (companyId) => {
    try {
        const affectedRows = await Companies.destroy({
            where: { id: companyId }
        });
        if (affectedRows === 0) {
            return {
                success: false,
                message: 'Company not found'
            };
        }

        return {
            success: true,
            message: 'Company deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};
