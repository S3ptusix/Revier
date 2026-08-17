import { fetchAllRejectedService } from "../services/rejectedServices.js";

// FETCH ALL REJECTED 
export const fetchAllRejectedController = async (req, res) => {
    try {

        const { role, id } = req.admin;
        const {
            search,
            companyId,
            page

        } = req.query;
        const result = await fetchAllRejectedService(
            search,
            companyId,
            page,
            role,
            id
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