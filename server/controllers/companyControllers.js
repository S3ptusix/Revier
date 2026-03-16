import { createCompanyService, deleteCompanyService, fetchAllCompanySelectService, fetchAllCompanyService, fetchCompanyTotalService, fetchOneCompanyService, updateCompanyService } from "../services/companyServices.js";

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

// FETCH ALL SELECT COMPANY
export const fetchAllCompanySelectController = async (req, res) => {
    try {
        const admin = req.admin;
        const result = await fetchAllCompanySelectService(admin.id);

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
        const { search, industry } = req.query;

        const result = await fetchAllCompanyService(
            search,
            industry
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

// FETCH ONE COMPANY
export const fetchOneCompanyController = async (req, res) => {
    try {
        const admin = req.admin;
        const { companyId } = req.params;
        const result = await fetchOneCompanyService(admin.id, companyId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// UPDATE COMPANY
export const updateCompanyController = async (req, res) => {
    try {
        const { companyId } = req.params;
        const {
            companyName,
            industry,
            location
        } = req.body;
        const result = await updateCompanyService(
            companyId,
            companyName,
            industry,
            location
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


// DELETE COMPANY
export const deleteCompanyController = async (req, res) => {
    try {
        const { companyId } = req.params;
        const result = await deleteCompanyService(companyId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH COMPANY TOTALS
export const fetchCompanyTotalController = async (req, res) => {
    try {
        const admin = req.admin;
        const result = await fetchCompanyTotalService(admin.id);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}
