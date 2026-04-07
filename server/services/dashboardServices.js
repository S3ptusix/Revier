import { Applicants, Jobs, OrientationEvents } from "../models/index.js";
import { Op } from 'sequelize';
// FETCH DASHBOARD TOTALS
export const fetchDashboardTotalService = async () => {
    try {

        let totals = {
            incommingOrientations: 0,
            pipelineApplicants: 0,
            openPositions: 0,
            scheduleForInterview: 0,
            scheduleForOrientation: 0
        }


        totals.incommingOrientations = await OrientationEvents.count();
        totals.pipelineApplicants = await Applicants.count({
            where: {
                applicantStatus: { [Op.not]: 'hired' },
                isRejected: 'No'
            }
        });
        totals.openPositions = await Jobs.count({
            where: {
                status: 'open'
            }
        });
        totals.scheduleForInterview = await Applicants.count({
            where: {
                applicantStatus: 'Interview',
                interviewAt: { [Op.not]: null }
            }
        });
        totals.scheduleForOrientation = await Applicants.count({
            where: {
                applicantStatus: 'Orientation',
                orientationId: { [Op.not]: null }
            }
        });

        return {
            success: true,
            totals,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};