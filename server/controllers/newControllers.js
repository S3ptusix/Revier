import { fetchAllNewService } from "../services/newServices.js";

// FETCH ALL NEW
export const fetchAllNewController = async (req, res) => {
    try {
        const {
            search,
            companyId,
            page
        } = req.query;
        const result = await fetchAllNewService(
            search,
            companyId,
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
