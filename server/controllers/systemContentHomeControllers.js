import {
    fetchHomeContentService,
    fetchHomeSectionService,
    updateHeroSectionService,
    updateHowItWorksSectionService,
    updateHowItWorksStepsService,
    updateContactSectionService,
    uploadSectionImageService
} from "../services/systemContentHomeServices.js";

// FETCH ALL HOME CONTENT
export const fetchHomeContentController = async (req, res) => {
    try {
        const result = await fetchHomeContentService();
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// FETCH HOME SECTION
export const fetchHomeSectionController = async (req, res) => {
    try {
        const { section } = req.params;
        const result = await fetchHomeSectionService(section);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE HERO SECTION
export const updateHeroSectionController = async (req, res) => {
    try {
        const { title, subTitle, button } = req.body;

        const result = await updateHeroSectionService(title, subTitle, button);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE HOW IT WORKS SECTION
export const updateHowItWorksSectionController = async (req, res) => {
    try {
        const { title } = req.body;
        const result = await updateHowItWorksSectionService(title);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE HOW IT WORKS STEPS
export const updateHowItWorksStepsController = async (req, res) => {
    try {
        const { steps } = req.body;
        const result = await updateHowItWorksStepsService(steps);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE CONTACT SECTION
export const updateContactSectionController = async (req, res) => {
    try {
        const { title, subTitle, email, phone, location } = req.body;
        const result = await updateContactSectionService(title, subTitle, email, phone, location);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// UPLOAD SECTION IMAGE
export const uploadSectionImageController = async (req, res) => {
    try {
        const { field } = req.params;
        const file = req.file;

        if (!file) {
            return res.json({
                success: false,
                message: "No image file provided."
            });
        }

        const result = await uploadSectionImageService(field, file);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};
