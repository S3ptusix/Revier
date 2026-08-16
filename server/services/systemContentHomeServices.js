import { sequelize } from "../config/sequelize.js";
import { HomeContent, HowItWorksStep } from "../models/index.js";
import { uploadFile, deleteFileByPublicId } from "../utils/cloudinaryFileHandler.js";

const IMAGE_FIELD_MAP = {
    heroImage1: { urlField: "heroImage1Url", publicIdField: "heroImage1PublicId", folder: "system_content/hero" },
    heroImage2: { urlField: "heroImage2Url", publicIdField: "heroImage2PublicId", folder: "system_content/hero" },
    howItWorksImage: {
        urlField: "howItWorksImageUrl",
        publicIdField: "howItWorksImagePublicId",
        folder: "system_content/how-it-works"
    },
    contactImage: { urlField: "contactImageUrl", publicIdField: "contactImagePublicId", folder: "system_content/contact" }
};

// shapes the flat HomeContent row + steps into the nested structure the frontend expects
const toResponseShape = (homeContent, steps) => ({
    heroSection: {
        title: homeContent.heroTitle,
        subTitle: homeContent.heroSubTitle,
        button: homeContent.heroButton,
        image1: homeContent.heroImage1Url,
        image1PublicId: homeContent.heroImage1PublicId,
        image2: homeContent.heroImage2Url,
        image2PublicId: homeContent.heroImage2PublicId
    },
    howItWorksSection: {
        title: homeContent.howItWorksTitle,
        image: homeContent.howItWorksImageUrl,
        imagePublicId: homeContent.howItWorksImagePublicId,
        steps: (steps || [])
            .sort((a, b) => a.order - b.order)
            .map((s) => ({ id: s.id, title: s.title, subTitle: s.subTitle, order: s.order }))
    },
    contactSection: {
        title: homeContent.contactTitle,
        subTitle: homeContent.contactSubTitle,
        details: {
            email: homeContent.contactEmail,
            phone: homeContent.contactPhone,
            location: homeContent.contactLocation
        },
        image: homeContent.contactImageUrl,
        imagePublicId: homeContent.contactImagePublicId
    }
});

const SECTION_KEY_MAP = {
    hero: "heroSection",
    howItWorks: "howItWorksSection",
    contact: "contactSection"
};

// FETCH ALL HOME CONTENT
export const fetchHomeContentService = async () => {
    try {
        const homeContent = await HomeContent.getSingleton();
        const steps = await HowItWorksStep.findAll({
            where: { homeContentId: homeContent.id },
            order: [["order", "ASC"]]
        });

        return {
            success: true,
            data: toResponseShape(homeContent, steps)
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message || "Failed to fetch homepage content" };
    }
};

// FETCH HOME SECTION
export const fetchHomeSectionService = async (section) => {
    try {
        if (!SECTION_KEY_MAP[section]) {
            return { success: false, message: `Invalid section "${section}"` };
        }

        const full = await fetchHomeContentService();
        if (!full.success) return full;

        return { success: true, data: full.data[SECTION_KEY_MAP[section]] };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message || "Failed to fetch section" };
    }
};

// UPDATE HERO SECTION
export const updateHeroSectionService = async (title, subTitle, button) => {
    try {
        const homeContent = await HomeContent.getSingleton();

        await homeContent.update({
            ...(title !== undefined && { heroTitle: title }),
            ...(subTitle !== undefined && { heroSubTitle: subTitle }),
            ...(button !== undefined && { heroButton: button })
        });

        const result = await fetchHomeSectionService("hero");
        return { success: true, message: "Hero section updated successfully", data: result.data };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message || "Failed to update hero section" };
    }
};

// UPDATE HOW IT WORKS SECTION
export const updateHowItWorksSectionService = async (title) => {
    try {
        const homeContent = await HomeContent.getSingleton();

        await homeContent.update({
            ...(title !== undefined && { howItWorksTitle: title })
        });

        const result = await fetchHomeSectionService("howItWorks");
        return { success: true, message: "How It Works section updated successfully", data: result.data };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message || "Failed to update How It Works section" };
    }
};

// UPDATE HOW IT WORKS STEPS
export const updateHowItWorksStepsService = async (steps) => {
    try {
        if (!Array.isArray(steps) || steps.length === 0) {
            return { success: false, message: "steps must be a non-empty array" };
        }

        const invalidStep = steps.find((s) => !s.title || typeof s.title !== "string");
        if (invalidStep) {
            return { success: false, message: "Each step requires a title" };
        }

        const homeContent = await HomeContent.getSingleton();

        const updatedSteps = await sequelize.transaction(async (t) => {
            await HowItWorksStep.destroy({ where: { homeContentId: homeContent.id }, transaction: t });

            const created = await HowItWorksStep.bulkCreate(
                steps.map((step, index) => ({
                    homeContentId: homeContent.id,
                    title: step.title,
                    subTitle: step.subTitle ?? null,
                    order: index
                })),
                { transaction: t }
            );

            return created
                .sort((a, b) => a.order - b.order)
                .map((s) => ({ id: s.id, title: s.title, subTitle: s.subTitle, order: s.order }));
        });

        return { success: true, message: "How It Works steps updated successfully", data: { steps: updatedSteps } };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message || "Failed to update How It Works steps" };
    }
};

// UPDATE CONTACT SECTION
export const updateContactSectionService = async (title, subTitle, email, phone, location) => {
    try {
        const homeContent = await HomeContent.getSingleton();

        await homeContent.update({
            ...(title !== undefined && { contactTitle: title }),
            ...(subTitle !== undefined && { contactSubTitle: subTitle }),
            ...(email !== undefined && { contactEmail: email }),
            ...(phone !== undefined && { contactPhone: phone }),
            ...(location !== undefined && { contactLocation: location })
        });

        const result = await fetchHomeSectionService("contact");
        return { success: true, message: "Contact section updated successfully", data: result.data };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message || "Failed to update contact section" };
    }
};

// UPLOAD/REPLACE SECTION IMAGE
export const uploadSectionImageService = async (field, file) => {
    try {

        const mapping = IMAGE_FIELD_MAP[field];
        if (!mapping) {
            return { success: false, message: `Invalid image field "${field}"` };
        }

        const homeContent = await HomeContent.getSingleton();
        const previousPublicId = homeContent[mapping.publicIdField];

        const uploaded = await uploadFile(file, mapping.folder);

        await homeContent.update({
            [mapping.urlField]: uploaded.url,
            [mapping.publicIdField]: uploaded.publicId
        });

        if (previousPublicId) {
            deleteFileByPublicId(previousPublicId).catch(console.error);
        }

        return {
            success: true,
            message: "Image uploaded successfully",
            data: { field, url: uploaded.url, publicId: uploaded.publicId }
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message || "Failed to upload image" };
    }
};
