import { createCompanyService, fetchAllCompanyService } from "../services/CompanyServices.js";

// CREATE COMPANY
export const createCompanyController = async (req, res) => {
    try {
        const { companyName, industry, location } = req.body;
        const result = await createCompanyService(companyName, industry, location);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL COMPANY
export const fetchAllCompanyController = async (req, res) => {
    try {
        const admin = req.admin;
        const result = await fetchAllCompanyService(admin.id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

