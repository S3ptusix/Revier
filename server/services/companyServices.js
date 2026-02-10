import Admins from "../models/Admin.js";
import { Companies } from '../models/index.js'
import { industries } from "../utils/data.js";
import { removeUnnecessarySpaces } from "../utils/format.js";

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
