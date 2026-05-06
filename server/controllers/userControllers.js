import { applyStatusService, applyUserService, editApplicationService, fetchAllNotificationService, fetchAllSavedJobListService, fetchAllSavedJobsService, fetchUserProfileService, recentApplicantionService, saveJobService, userLoginService, userRegistrationService, userUpdateService } from "../services/userServices.js";
import { cookieOptions } from "../utils/cookie.js";

// REGISTER USER 
export const userRegistrationController = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            sex,
            email,
            password,
            confirmPassword
        } = req.body;
        const result = await userRegistrationService(
            firstName,
            lastName,
            sex,
            email,
            password,
            confirmPassword
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

// LOGIN USER
export const userLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userLoginService(email, password);

        if (!result.success) {
            return res.json(result)
        }

        res.cookie('userToken', result.token, cookieOptions);

        return res.json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH USER
export const fetchUserController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.json({
                success: false,
                user: null
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            user: null,
            message: error.message
        });
    }
};

// LOGOUT USER
export const logoutUserController = (req, res) => {
    res.clearCookie('userToken', cookieOptions);
    return res.json({ success: true, message: 'Logged out successfully' });
};

// UPDATE USER PROFILE
export const userUpdateController = async (req, res) => {
    try {
        const user = req.user;
        const {
            firstName,
            lastName,
            sex,
            phone,
            linkedIn,
            portfolio
        } = req.body;
        const resume = req.files?.resume?.[0];
        const validId = req.files?.validId?.[0];

        const result = await userUpdateService(
            user.id,
            firstName,
            lastName,
            sex,
            phone,
            linkedIn,
            portfolio,
            resume,
            validId
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

// FETCH USER PROFILE
export const fetchUserProfileController = async (req, res) => {
    try {
        const user = req.user;
        const result = await fetchUserProfileService(user.id);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// APPLY
export const applyUserController = async (req, res) => {
    try {
        const user = req.user;
        const { jobId } = req.params;
        const {
            firstName,
            lastName,
            sex,
            phone,
            linkedIn,
            portfolio
        } = req.body;
        const resume = req.files?.resume?.[0];
        const validId = req.files?.validId?.[0];

        const result = await applyUserService(
            user.id,
            jobId,
            firstName,
            lastName,
            sex,
            phone,
            linkedIn,
            portfolio,
            resume,
            validId
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

// EDIT APPLICATION
export const editApplicationController = async (req, res) => {
    try {

        const { applicationId } = req.params;
        const {
            firstName,
            lastName,
            sex,
            phone,
            linkedIn,
            portfolio
        } = req.body;
        const resume = req.files?.resume?.[0];
        const validId = req.files?.validId?.[0];

        const result = await editApplicationService(
            applicationId,
            firstName,
            lastName,
            sex,
            phone,
            linkedIn,
            portfolio,
            resume,
            validId
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

// RECENT APPLICATIONS
export const recentApplicantionController = async (req, res) => {
    try {
        const user = req.user;
        const { page } = req.query;
        console.log({ page });
        const result = await recentApplicantionService(user.id, page);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL NOTIFICATION
export const fetchAllNotificationController = async (req, res) => {
    try {
        const user = req.user;
        const { page } = req.query;
        const result = await fetchAllNotificationService(user.id, page);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// SAVE JOB
export const saveJobController = async (req, res) => {
    try {
        const user = req.user;
        const { jobId } = req.params;
        const result = await saveJobService(user.id, jobId);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL SAVE JOB LIST
export const fetchAllSavedJobListController = async (req, res) => {
    try {
        const user = req.user;
        const result = await fetchAllSavedJobListService(user.id);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL SAVED JOB
export const fetchAllSavedJobsController = async (req, res) => {
    try {
        const user = req.user;
        const { page } = req.query;
        const result = await fetchAllSavedJobsService(user.id, page);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}

// IS APPLIED TO THE JOB
export const applyStatusController = async (req, res) => {
    try {
        const user = req.user;
        const { jobId } = req.params;
        const result = await applyStatusService(user.id, jobId);

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
}