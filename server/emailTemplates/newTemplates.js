export const rejectHTML = ({
    firstName = "Applicant",
    jobTitle,
    companyName,
    rejectedReason = "",
    reapplyDays = 30
}) => {
    return (
        `
        <div style="font-family: Arial, sans-serif; color:#111827; line-height:1.6;">

                <p>Hi ${firstName},</p>

                <p>
                Thank you for your interest in the <strong>${jobTitle}</strong> position at 
                <strong>${companyName}</strong>.
                </p>

                <p>
                After careful review, we regret to inform you that your application will not be moving forward at this time.
                </p>

                ${rejectedReason
                            ? `
                <p style="margin-top:15px;">
                <strong>Feedback:</strong><br/>
                <span style="white-space: pre-line;">${rejectedReason}</span>
                </p>
                `
                            : ""
                        }

                <p style="margin-top:15px;">
                You may apply again after <strong>${reapplyDays} days</strong>.
                </p>

                <p style="margin-top:20px;">
                Thank you for your time and interest.
                </p>

                <p style="margin-top:20px;">
                Best regards,<br/>
                Recruitment Team
                </p>

        </div>
        `
    )
};

export const forInterviewHTML = ({
    firstName,
    jobTitle,
    companyName,
    scheduleSummary,
    interviewNotes
}) => {
    return (
        `
        <div style="font-family: Arial, sans-serif; color:#111827; line-height:1.6;">

            <p>Hi ${firstName || "Applicant"},</p>

            <p>
                You have been scheduled for an interview for the 
                <strong>${jobTitle}</strong> position at 
                <strong>${companyName}</strong>.
            </p>

            <p style="margin-top:15px;">
                <strong>Schedule Details:</strong><br/>
                <span style="white-space: pre-line;">${scheduleSummary}</span>
            </p>

            ${interviewNotes
                    ? `
            <p style="margin-top:15px;">
                <strong>Notes:</strong><br/>
                <span style="white-space: pre-line;">${interviewNotes}</span>
            </p>
            `
                    : ""
                }

            <p style="margin-top:20px;">
                Please ensure you are available at the scheduled time.
            </p>

            <p style="margin-top:20px;">
                Please attend the session on time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.
            </p>

            <p style="margin-top:20px;">
                Best regards,<br/>
                Recruitment Team
            </p>

        </div>
        `
    )
};