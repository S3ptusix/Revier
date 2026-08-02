import { failedInterviewHTML, forOrientationHTML, rescheduleInterviewHTML } from '../emailTemplates/interviewTemplates.js';
import { Applicants, Companies, Jobs, Notification, OrientationEvents, Users } from '../models/index.js'
import { formatDateTime } from '../utils/format.js';
import { sendMail } from '../utils/mailer.js';
import { io } from "../server.js";

// FAILED INTERVIEW
export const failedInterviewService = async (
    applicantId,
    rejectedReason
) => {
    try {

        if (
            isNaN(applicantId) ||
            !rejectedReason?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            applicantStatus: "Interview",
            interviewStatus: "Failed",
            isRejected: true,
            rejectedAt: new Date(),
            rejectedReason
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
        })

        const message = `Thank you for taking the time to interview for the ${applicant?.job?.jobTitle} position at ${applicant?.job?.company?.companyName}.
        
After careful review, we regret to inform you that we will not be proceeding with your application at this time.
${rejectedReason ? `
Feedback: ${rejectedReason}

We appreciate your interest and encourage you to apply again in the future.`
                : "We appreciate your interest and encourage you to apply again in the future."}`;

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
            subject: `Interview Update – ${applicant?.job?.jobTitle}`,
            html: failedInterviewHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                rejectedReason
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

// RESCHEDULE INTERVIEW
export const rescheduleInterviewService = async (
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
        
        console.log("incoming interviewAt:", interviewAt);
        const utcInterviewAt = new Date(interviewAt).toISOString();

        await Applicants.update({
            interviewAt: utcInterviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes,
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

        const message = `Updated Details:
${scheduleSummary} 
       
Notes:
${interviewNotes} 

Please ensure you are available at the scheduled time.
            
Please attend the session on time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.`;

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message
        });

        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        await sendMail({
            to: applicant.user.email,
            subject: `Interview Rescheduled – ${applicant?.job?.jobTitle}`,
            html: rescheduleInterviewHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                scheduleSummary,
                interviewNotes
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

// FOR ORIENTATION
export const forOrientationService = async (applicantId, orientationId) => {
    try {
        if (
            isNaN(applicantId) ||
            isNaN(orientationId)
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            applicantStatus: 'Orientation',
            interviewResult: 'Passed',
            orientationId
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
                },
                {
                    model: OrientationEvents,
                    attributes: ['eventTitle', 'location', 'eventAt', 'note']
                }
            ]
        });

        const event = applicant?.orientationEvent;

        const message = `You are scheduled for an orientation:

Event: ${event?.eventTitle}
Date & Time: ${formatDateTime(event?.eventAt)}
Location: ${event?.location}

${event?.note ?
                `Notes:
${event?.note}

Please attend the session on time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.`
                : 'Please attend the session on time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.'}`;

        if (event) {
            const notification = await Notification.create({
                userId: applicant?.userId,
                title: applicant?.job?.jobTitle,
                subTitle: applicant?.job?.company?.companyName,
                message,
                type: "success"
            });

            io.to(`user_${applicant.userId}`).emit("newNotification", notification);
        }

        await sendMail({
            to: applicant.user.email,
            subject: `Orientation Scheduled – ${applicant?.job?.jobTitle}`,
            html: forOrientationHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                eventTitle: event?.eventTitle,
                eventAt: event?.eventAt,
                eventLocation: event?.location,
                eventNote: event?.note
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