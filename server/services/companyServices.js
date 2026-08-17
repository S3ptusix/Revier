import { sequelize } from "../config/sequelize.js";
import { Admins, Companies, Jobs } from '../models/index.js'
import { io } from "../server.js";
import { industries } from "../utils/data.js";
import { removeUnnecessarySpaces } from "../utils/format.js";
import { Sequelize, Op } from "sequelize";
import { getCompanyScope } from "../utils/getCompanyScope.js";

// CREATE COMPANY
export const createCompanyService = async (
    companyName,
    industry,
    location,
    longitude,
    latitude
) => {
    try {
        // Required fields
        if (!companyName.trim() || !industry.trim() || !location.trim() || !longitude || !latitude) {

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
            location: formattedLocation,
            longitude,
            latitude
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

// FETCH ALL COMPANY SELECT
export const fetchAllCompanySelectService = async (role, adminId) => {
    try {

        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) return { success: true, companies: [] };

        const companies = await Companies.findAll({
            where: scope.companyWhere,
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
export const fetchAllCompanyService = async (search = "", industry = "", page = 1, role, adminId) => {
    try {
        search = search.trim();
        const limit = 10;
        const offset = (page - 1) * limit;

        const companyWhere = {};
        if (search) companyWhere.companyName = { [Op.like]: `%${search}%` };
        if (industry) companyWhere.industry = industry;

        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) return { success: true, companies: [], pagination: { total: 0, totalPages: 0 } };

        Object.assign(companyWhere, scope.companyWhere);

        const total = await Companies.count({ where: companyWhere });

        const companies = await Companies.findAll({
            where: companyWhere,
            attributes: [
                "id",
                "companyName",
                "industry",
                "location",
                [Sequelize.fn("COUNT", Sequelize.col("jobs.id")), "jobCount"]],
            include: [
                {
                    model: Jobs,
                    as: "jobs",
                    attributes: [],
                    where: { status: "open" },
                    required: false
                }
            ],
            group: ["company.id"],
            order: [["companyName", "ASC"]],
            limit,
            offset,
            subQuery: false,
        });

        return { success: true, companies, pagination: { total, totalPages: Math.ceil(total / limit) } };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
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
                'longitude',
                'latitude'
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
    location,
    longitude,
    latitude

) => {
    try {

        if (
            !companyName.trim() ||
            !industry.trim() ||
            !location.trim() ||
            !longitude ||
            !latitude
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        await Companies.update({
            companyName,
            industry,
            location,
            longitude,
            latitude
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
    const transaction = await sequelize.transaction();

    try {
        await Companies.destroy({
            where: { id: companyId },
            transaction
        });

        await Jobs.destroy({
            where: { companyId },
            transaction
        });

        await transaction.commit();
        io.to("admins").emit("dashboard");

        return {
            success: true,
            message: "Company and related jobs archived successfully"
        };
    } catch (error) {
        await transaction.rollback();

        return {
            success: false,
            message: error.message
        };
    }
};

// FETCH COMPANY TOTALS
export const fetchCompanyTotalService = async (role, adminId) => {
    try {
        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) return { success: true, totals: { totalCompanies: 0, totalActiveJobs: 0 } };

        const totals = {
            totalCompanies: await Companies.count({ where: scope.companyWhere }),
            totalActiveJobs: await Jobs.count({
                where: { status: 'open' },
                include: [{ model: Companies, as: 'company', where: scope.companyWhere, required: true }],
            }),
        };

        return { success: true, totals };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};

// FETCH ALL ARCHIVE COMPANIES
export const fetchAllArchiveCompanyService = async (search = "", industry = "", page = 1, role, adminId) => {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;

        const companyWhere = { deletedAt: { [Op.ne]: null } };
        if (search) companyWhere.companyName = { [Op.like]: `%${search}%` };
        if (industry) companyWhere.industry = industry;

        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) return { success: true, companies: [], pagination: { total: 0, totalPages: 0 } };

        Object.assign(companyWhere, scope.companyWhere);

        const total = await Companies.count({ where: companyWhere, paranoid: false });

        const companies = await Companies.findAll({
            where: companyWhere,
            paranoid: false,
            attributes: [
                "id",
                "companyName",
                "industry",
                "location",
                "deletedAt",
                [Sequelize.fn("COUNT", Sequelize.col("jobs.id")), "jobCount"]],
            include: [
                {
                    model: Jobs,
                    as: "jobs",
                    attributes: [],
                    where: { status: "open" },
                    required: false
                }
            ],
            group: ["company.id"],
            order: [["companyName", "ASC"]],
            limit,
            offset,
            subQuery: false,
        });

        return { success: true, companies, pagination: { total, totalPages: Math.ceil(total / limit) } };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};

// RESTORE COMPANY 
export const restoreCompanyService = async (companyId) => {
    try {
        const company = await Companies.findByPk(companyId, {
            paranoid: false,
        });

        if (!company) {
            return {
                success: false,
                message: "Company not found",
            };
        }

        if (!company.deletedAt) {
            return {
                success: false,
                message: "Company is already active",
            };
        }

        // Restore company
        await company.restore();

        // Restore all related jobs
        await Jobs.restore({
            where: {
                companyId: company.id
            }
        });

        io.to("admins").emit("dashboard");

        return {
            success: true,
            message: "Company and related jobs restored successfully",
        };

    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};