import Admins from "../models/Admin.js";
import { Companies, Jobs } from '../models/index.js'
import { industries } from "../utils/data.js";
import { removeUnnecessarySpaces } from "../utils/format.js";
import { Sequelize, Op } from "sequelize";

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
export const fetchAllCompanySelectService = async () => {
    try {

        const companies = await Companies.findAll({
            attributes: ["id", "companyName"],
            order: [["companyName", "ASC"]],
        });

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
export const fetchAllCompanyService = async (search = '', industry = '') => {
    try {

        const companyWhere = {};
        if (search) companyWhere.companyName = { [Op.like]: `%${search}%` };
        if (industry) companyWhere.industry = industry;

        const companies = await Companies.findAll({
            where: companyWhere,
            attributes: [
                "id",
                "companyName",
                "industry",
                "location",
                [Sequelize.fn("COUNT", Sequelize.col("jobs.id")), "jobCount"]
            ],
            include: [
                {
                    model: Jobs,
                    as: "jobs",
                    attributes: [],
                    where: { status: 'open' } // always filter open jobs
                }
            ],
            group: ["company.id"], // must match model name
            order: [["companyName", "ASC"]],
        });

        return {
            success: true,
            companies
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
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

// FETCH COMPANY TOTALS
export const fetchCompanyTotalService = async (adminId) => {
    try {

        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        let totals = {
            totalCompanies: 0,
            totalActiveJobs: 0,
        };

        totals.totalCompanies = await Companies.count();
        totals.totalActiveJobs = await Jobs.count({
            where: {
                status: 'open'
            },
            include: [
                {
                    model: Companies,
                    as: 'company',
                    required: true
                }
            ]
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