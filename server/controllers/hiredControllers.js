import { fetchAllHiredService } from "../services/hiredServices.js";

// FETCH ALL HIRED
export const fetchAllHiredController = async (req, res) => {
    try {
        const { role, id } = req.admin;
        const {
            search,
            companyId,
            page
        } = req.query;
        const result = await fetchAllHiredService(
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