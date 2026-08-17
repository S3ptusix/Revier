import { col, fn, Op, where } from "sequelize";
import { Applicants, Companies, Jobs, Notification, Users } from "../models/index.js";
import { io } from "../server.js";
import { sendMail } from "../utils/mailer.js";
import { forInterviewHTML, rejectHTML } from "../emailTemplates/newTemplates.js";
import { convertPHToUTC, formatDateTime, renderMessageWithLinks } from "../utils/format.js";
import { addDays } from "../utils/tools.js";
import { getCompanyScope } from '../utils/getCompanyScope.js';
import { generateContactAdminMessage } from "../utils/generateMessage.js";

// REJECT
export const rejectService = async (
    applicantId,
    rejectedReason,
    rejectedReasonNote,
    admin
) => {
    try {

        if (
            isNaN(applicantId) ||
            !rejectedReason?.trim() ||
            !rejectedReasonNote?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            isRejected: true,
            rejectedAt: new Date(),
            rejectedReason,
            rejectedReasonNote,
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

        const contactAdmin = generateContactAdminMessage(admin);

        const message = `After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.
                
Feedback: ${rejectedReasonNote}
        
You may apply again after 30 days
        
We appreciate your time and interest, and we encourage you to apply again in the future.

${contactAdmin}`;

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
                rejectedReasonNote: renderMessageWithLinks(rejectedReasonNote),
                reapplyDays: 30,
                contactAdmin: renderMessageWithLinks(contactAdmin)
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
    role,
    adminId
) => {
    try {
        search = search.trim();

        const limit = 10;
        const offset = (page - 1) * limit;

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

        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) {
            return {
                success: true,
                applicants: [],
                pagination: { total: 0, totalPages: 0 }
            };
        }

        // ---- STEP 1: get ALL matching, ordered applicant IDs (plain SELECT, no aggregates) ----
        const idRowsAll = await Applicants.findAll({
            attributes: ['id'],
            include: [
                {
                    model: Users,
                    attributes: [],
                    required: true
                },
                {
                    model: Jobs,
                    as: 'job',
                    attributes: [],
                    where: jobWhere,
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: [],
                            required: true,
                            where: scope.companyWhere
                        }
                    ]
                }
            ],
            where: whereClause,
            order: [['createdAt', 'ASC'], ['id', 'ASC']],
            subQuery: false,
            raw: true
        });

        const count = idRowsAll.length;
        const totalPages = Math.ceil(count / limit);

        if (count === 0) {
            return {
                success: true,
                applicants: [],
                pagination: {
                    total: 0,
                    totalPages: 0
                }
            };
        }

        // ---- STEP 1b: slice to the requested page ----
        const pageRows = idRowsAll.slice(offset, offset + limit);

        if (pageRows.length === 0) {
            return {
                success: true,
                applicants: [],
                pagination: {
                    total: count,
                    totalPages
                }
            };
        }

        const idOrder = pageRows.map(r => r.id);

        // ---- STEP 2: hydrate full data for just those IDs ----
        let applicants = await Applicants.findAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'blacklistedReason',
                'createdAt'
            ],
            where: {
                id: idOrder
            },
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
                    required: true,
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

        // Re-apply the exact order from step 1
        const orderIndex = new Map(idOrder.map((id, i) => [id, i]));
        applicants.sort(
            (a, b) => orderIndex.get(a.id) - orderIndex.get(b.id)
        );

        return {
            success: true,
            applicants,
            pagination: {
                total: count,
                totalPages
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
    scheduleSummary,
    admin
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

        const contactAdmin = generateContactAdminMessage(admin);

        const message = `Schedule Details:
${scheduleSummary}
        
Notes:    
${interviewNotes}
        
Please ensure you are available at the scheduled time.
        
Please attend the session on time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.

${contactAdmin}`;

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
                scheduleSummary: renderMessageWithLinks(scheduleSummary),
                interviewNotes: renderMessageWithLinks(scheduleSummary),
                contactAdmin: renderMessageWithLinks(contactAdmin)
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