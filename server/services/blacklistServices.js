import { blacklistHTML } from "../emailTemplates/blacklistTemplates.js";
import { Applicants, Companies, Jobs, Notification, Users } from "../models/index.js";
import { io } from "../server.js";
import { sendMail } from "../utils/mailer.js";

// BLACKLIST
export const blacklistService = async (
    admin,
    applicantId,
    blacklistedReason
) => {
    try {

        if (!applicantId || isNaN(applicantId)) {
            return {
                success: false,
                message: "Invalid applicant ID."
            };
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['id', 'userId'],
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
                    include: [{
                        model: Companies,
                        as: 'company',
                        attributes: ['companyName']
                    }]
                }
            ]
        });

        if (!applicant) {
            return {
                success: false,
                message: "Applicant not found."
            };
        }

        if (!blacklistedReason || !blacklistedReason.trim()) {
            await applicant.update({
                blacklistedReason: null
            });

            return {
                success: true,
                message: "Blacklist removed."
            };
        }

        await applicant.update({
            blacklistedBy: admin.id,
            blacklistedReason: blacklistedReason.trim(),
            isRejected: true,
            rejectedAt: new Date(),
        });

        const message = `Thank you for your interest in the ${applicant.job.jobTitle} position at ${applicant.job.company.companyName}

After review, we regret to inform you that your application has been restricted for the following reason:
        
${blacklistedReason}
        
As a result, you are currently not eligible to apply for opportunities within this company.
        
Thank you for your understanding.`

        const notification = await Notification.create({
            userId: applicant.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            // message: `Application update for ${applicant?.job?.jobTitle} at ${applicant?.job?.company?.companyName}: restricted due to policy reasons${blacklistedReason ? ` – ${blacklistedReason}` : ''}.`,
            message,
            type: "error"
        });

        io.to("admins").emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        await sendMail({
            to: applicant.user.email,
            subject: `Application Update – ${applicant.job.jobTitle}`,
            html: blacklistHTML({
                firstName: applicant.user.firstName,
                jobTitle: applicant.job.jobTitle,
                companyName: applicant.job.company.companyName,
                reason: blacklistedReason
            })
        });

        return {
            success: true,
            message: "Applicant has been blacklisted."
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// FETCH BLACKLIST REASON
export const fetchBlacklistReasonService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }
        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['blacklistedReason']
        })

        return {
            success: true,
            blacklistedReason: applicant.blacklistedReason
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}