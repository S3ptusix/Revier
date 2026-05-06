import { createCompanyService, deleteCompanyService, fetchAllArchiveCompanyService, fetchAllCompanySelectService, fetchAllCompanyService, fetchCompanyTotalService, fetchOneCompanyService, restoreCompanyService, updateCompanyService } from "../services/companyServices.js";

// CREATE COMPANY
export const createCompanyController = async (req, res) => {
    try {
        const {
            companyName,
            industry,
            location,
            longitude,
            latitude

        } = req.body;
        const result = await createCompanyService(
            companyName,
            industry,
            location,
            longitude,
            latitude
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
        const {
            search,
            industry,
            page
        } = req.query;

        const result = await fetchAllCompanyService(
            search,
            industry,
            page
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
            location,
            longitude,
            latitude
        } = req.body;
        const result = await updateCompanyService(
            companyId,
            companyName,
            industry,
            location,
            longitude,
            latitude
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

// FETCH ALL ARCHIVE COMPANY
export const fetchAllArchiveCompanyController = async (req, res) => {
    try {
        const {
            search,
            industry,
            page
        } = req.query;

        const result = await fetchAllArchiveCompanyService(
            search,
            industry,
            page
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

// RESTORE COMPANY
export const restoreCompanyController = async (req, res) => {
    try {
        const { companyId } = req.params;
        const result = await restoreCompanyService(companyId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}