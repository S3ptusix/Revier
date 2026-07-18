import { Applicants, Jobs, OrientationEvents } from "../models/index.js";
import { Op, Sequelize } from "sequelize";

// FETCH DASHBOARD TOTALS
export const fetchDashboardTotalService = async () => {
    try {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let totals = {
            incommingOrientations: 0,
            pipelineApplicants: 0,
            openPositions: 0,
            closedPositions: 0,

            scheduleForInterview: 0,
            unscheduledInterview: 0,

            scheduleForOrientation: 0,
            unscheduledOrientation: 0,

            totalPerStage: {}
        };

        // ✅ Incoming Orientations (today + future only)
        totals.incommingOrientations = await OrientationEvents.count({
            where: {
                eventAt: {
                    [Op.gte]: today
                }
            }
        });

        // ✅ Pipeline (not hired + not rejected)
        totals.pipelineApplicants = await Applicants.count({
            where: {
                applicantStatus: { [Op.not]: "Hired" },
                isRejected: "No"
            }
        });

        // ✅ Open / Closed Positions
        totals.openPositions = await Jobs.count({
            where: { status: "open" }
        });

        totals.closedPositions = await Jobs.count({
            where: { status: "closed" }
        });

        // ✅ Scheduled Interview
        totals.scheduleForInterview = await Applicants.count({
            where: {
                applicantStatus: "Interview",
                interviewAt: { [Op.not]: null }
            }
        });

        // ✅ Unscheduled Interview
        totals.unscheduledInterview = await Applicants.count({
            where: {
                applicantStatus: "Interview",
                interviewAt: null
            }
        });

        // ✅ Scheduled Orientation
        totals.scheduleForOrientation = await Applicants.count({
            where: {
                applicantStatus: "Orientation",
                orientationId: { [Op.not]: null }
            }
        });

        // ✅ Unscheduled Orientation
        totals.unscheduledOrientation = await Applicants.count({
            where: {
                applicantStatus: "Orientation",
                orientationId: null
            }
        });

        // ✅ TOTAL PER STAGE (ONLY ACTIVE PIPELINE)
        const stageCounts = await Applicants.findAll({
            attributes: [
                "applicantStatus",
                [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]
            ],
            where: {
                applicantStatus: {
                    [Op.in]: ["New", "Interview", "Orientation"]
                },
                isRejected: "No" // ⚠️ change to false if boolean
            },
            group: ["applicantStatus"],
            raw: true
        });

        const stages = ["New", "Interview", "Orientation"];

        stages.forEach(stage => {
            const found = stageCounts.find(s => s.applicantStatus === stage);
            totals.totalPerStage[stage] = found ? Number(found.count) : 0;
        });
        console.log("Dashboard Totals:", totals);
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