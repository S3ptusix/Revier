import { col, fn, Op, where } from "sequelize";
import { Applicants, Companies, Jobs, Notification, Users } from "../models/index.js";
import { io } from "../server.js";
import { sendMail } from "../utils/mailer.js";
import { forInterviewHTML, rejectHTML } from "../emailTemplates/newTemplates.js";
import { convertPHToUTC, formatDateTime } from "../utils/format.js";
import { addDays } from "../utils/tools.js";

// REJECT
export const rejectService = async (applicantId, rejectedReason) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Applicant not found."
            };
        }

        await Applicants.update({
            isRejected: true,
            rejectedAt: new Date(),
            rejectedReason,
            canApplyAgainAt: addDays(new Date(), 30)
        }, {
            where: { id: applicantId }
        });

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['email', 'firstName']
                },
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ]
        });

        const message = `After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.
                
Feedback: ${rejectedReason}
        
You may apply again after 30 days
        
We appreciate your time and interest, and we encourage you to apply again in the future.`;

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message,
            type: 'error'
        });

        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        await sendMail({
            to: applicant.user.email,
            subject: `Application Update – ${applicant?.job?.jobTitle}`,
            html: rejectHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                rejectedReason,
                reapplyDays: 30
            })
        });

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FETCH ALL NEW 
export const fetchAllNewService = async (
    search = '',
    companyId = '',
    page = 1,
) => {
    try {
        search = search.trim();

        const limit = 10;

        const whereClause = {
            applicantStatus: 'New',
            isRejected: false,
        };

        const jobWhere = {};
        if (companyId) {
            jobWhere.companyId = companyId;
        }

        // SEARCH
        if (search) {
            whereClause[Op.or] = [
                where(
                    fn(
                        "concat",
                        col("applicant.firstName"),
                        " ",
                        col("applicant.lastName")
                    ),
                    { [Op.like]: `%${search}%` }
                ),
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows: applicants } = await Applicants.findAndCountAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'blacklistedReason',
                'createdAt'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email'],
                    required: true,
                    include: [
                        {
                            model: Applicants,
                            attributes: ['id'],
                            where: {
                                blacklistedReason: {
                                    [Op.ne]: null
                                }
                            },
                            required: false
                        }
                    ]
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    where: jobWhere,
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: whereClause,
            limit,
            offset,
            order: [['createdAt', 'ASC']],
            distinct: true,
            subQuery: false
        });

        return {
            success: true,
            applicants,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// FOR INTERVIEW
export const forInterviewService = async (
    applicantId,
    interviewAt,
    interviewMode,
    interviewLocation,
    interviewNotes,
    scheduleSummary
) => {
    try {

        if (
            isNaN(applicantId) ||
            !interviewAt?.trim() ||
            !interviewMode?.trim() ||
            !interviewLocation?.trim() ||
            !interviewNotes?.trim() ||
            !scheduleSummary?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            applicantStatus: 'Interview',
            interviewAt: convertPHToUTC(interviewAt),
            interviewMode,
            interviewLocation,
            interviewNotes
        }, {
            where: { id: applicantId }
        });

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['email', 'firstName']
                },
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ]
        });

        const message = `Schedule Details:
${scheduleSummary}
        
Notes:    
${interviewNotes}
        
Please ensure you are available at the scheduled time.
        
Please attend the session on time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.`;

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message,
            type: "success"
        });


        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        await sendMail({
            to: applicant.user.email,
            subject: `Interview Scheduled – ${applicant?.job?.jobTitle}`,
            html: forInterviewHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                scheduleSummary,
                interviewNotes
            })
        });

        return {
            success: true,
            message: "Applicant scheduled for interview successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}