// services/dashboardService.js

import { Op, fn, col } from "sequelize";
import { Applicants, Jobs, OrientationEvents } from "../models/index.js";
import { calculateChange } from "../utils/tools.js";

export const fetchDashboardDataService = async () => {
    try {
        const now = new Date();

        // ============================
        // DATE RANGES
        // ============================
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // ============================
        // 1. PIPELINE COUNTS
        // ============================
        const pipelineCounts = await Applicants.findAll({
            attributes: [
                "applicantStatus",
                [fn("COUNT", col("id")), "count"]
            ],
            where: {
                isRejected: false
            },
            group: ["applicantStatus"]
        });

        const pipeline = {
            New: 0,
            Interview: 0,
            Orientation: 0,
            Hired: 0
        };

        pipelineCounts.forEach(item => {
            pipeline[item.applicantStatus] = Number(item.dataValues.count);
        });

        // ============================
        // 2. SUMMARY WITH COMPARISON
        // ============================

        // TOTAL APPLICANTS (All active vs last month new)
        const totalApplicants = await Applicants.count({
            where: { isRejected: false }
        });

        const lastMonthApplicants = await Applicants.count({
            where: {
                isRejected: false,
                createdAt: {
                    [Op.between]: [startOfLastMonth, endOfLastMonth]
                }
            }
        });

        // HIRED
        const hiredThisMonth = await Applicants.count({
            where: {
                applicantStatus: "Hired",
                hiredAt: {
                    [Op.gte]: startOfMonth
                }
            }
        });

        const hiredLastMonth = await Applicants.count({
            where: {
                applicantStatus: "Hired",
                hiredAt: {
                    [Op.between]: [startOfLastMonth, endOfLastMonth]
                }
            }
        });

        // REJECTED
        const rejectedThisMonth = await Applicants.count({
            where: {
                isRejected: true,
                rejectedAt: {
                    [Op.gte]: startOfMonth
                }
            }
        });

        const rejectedLastMonth = await Applicants.count({
            where: {
                isRejected: true,
                rejectedAt: {
                    [Op.between]: [startOfLastMonth, endOfLastMonth]
                }
            }
        });

        // OPEN POSITIONS
        const openPositions = await Jobs.count({
            where: { status: "Open" }
        });

        const openPositionsLastMonth = await Jobs.count({
            where: {
                status: "Open",
                createdAt: {
                    [Op.lte]: endOfLastMonth
                }
            }
        });

        // ============================
        // 3. INTERVIEWS TODAY
        // ============================
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const interviewsToday = await Applicants.findAll({
            where: {
                applicantStatus: "Interview",
                interviewAt: {
                    [Op.between]: [todayStart, todayEnd]
                }
            },
            attributes: [
                "id",
                "firstName",
                "lastName",
                "interviewAt",
                "interviewMode"
            ],
            order: [["interviewAt", "ASC"]]
        });


        // ============================
        // 4. UPCOMING ORIENTATIONS (EVENTS)
        // ============================
        const upcomingOrientations = await OrientationEvents.findAll({
            where: {
                eventAt: {
                    [Op.gte]: now
                }
            },
            attributes: [
                "id",
                "eventTitle",
                "location",
                "eventAt"
            ],
            order: [["eventAt", "ASC"]],
            limit: 10
        });

        // ============================
        // FINAL RESPONSE
        // ============================
        return {
            summary: {
                totalApplicants: calculateChange(totalApplicants, lastMonthApplicants),
                hired: calculateChange(hiredThisMonth, hiredLastMonth),
                rejected: calculateChange(rejectedThisMonth, rejectedLastMonth),
                openPositions: calculateChange(openPositions, openPositionsLastMonth)
            },
            pipeline,
            schedules: {
                interviewsToday,
                upcomingOrientations
            }
        };

    } catch (error) {
        throw error;
    }
};