export const rejectHTML = ({
    firstName = "Applicant",
    jobTitle,
    companyName,
    rejectedReason = "",
    reapplyDays = 30
}) => {
    return (
        `
        <div style="background-color:#f7f7f7; padding:40px 0; font-family:Arial, sans-serif;">
            <div style="
                max-width:480px;
                margin:0 auto;
                background:#ffffff;
                border-radius:8px;
                overflow:hidden;
                border:1px solid #eaeaea;
            ">

                <!-- Header -->
                <div style="padding:32px 24px 8px; text-align:center;">
                    <h1 style="margin:0; color:#111827; font-size:18px; font-weight:600;">
                        REVIER
                    </h1>
                </div>

                <!-- Body -->
                <div style="padding:16px 32px 32px; color:#374151;">
                    <p style="font-size:15px; margin-bottom:4px; text-align:center; color:#111827; font-weight:600;">
                        Application Update
                    </p>
                    <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
                        A decision has been made regarding your application.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Hi ${firstName},
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Thank you for your interest in the <strong>${jobTitle}</strong> position at
                        <strong>${companyName}</strong>.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        After careful review, we regret to inform you that your application will not be moving forward at this time.
                    </p>

                    ${rejectedReason
                            ? `
                    <div style="
                        margin:20px 0;
                        padding:16px 18px;
                        border-radius:6px;
                        background-color:#f9fafb;
                        border:1px solid #eaeaea;
                    ">
                        <p style="font-size:13px; font-weight:600; color:#111827; margin:0 0 6px;">Feedback</p>
                        <span style="font-size:14px; line-height:1.6; color:#374151; white-space:pre-line;">${rejectedReason}</span>
                    </div>
                    `
                            : ""
                        }

                    <p style="font-size:14px; line-height:1.6;">
                        You may apply again after <strong>${reapplyDays} days</strong>.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Thank you for your time and interest.
                    </p>

                    <p style="font-size:14px; margin-bottom:0;">
                        Best regards,<br />
                        <strong>Recruitment Team</strong>
                    </p>
                </div>

                <!-- Footer -->
                <div style="
                    padding:14px;
                    text-align:center;
                    font-size:11px;
                    color:#9ca3af;
                    border-top:1px solid #f3f4f6;
                ">
                    © ${new Date().getFullYear()} REVIER. All rights reserved.
                </div>

            </div>
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
        <div style="background-color:#f7f7f7; padding:40px 0; font-family:Arial, sans-serif;">
            <div style="
                max-width:480px;
                margin:0 auto;
                background:#ffffff;
                border-radius:8px;
                overflow:hidden;
                border:1px solid #eaeaea;
            ">

                <!-- Header -->
                <div style="padding:32px 24px 8px; text-align:center;">
                    <h1 style="margin:0; color:#111827; font-size:18px; font-weight:600;">
                        REVIER
                    </h1>
                </div>

                <!-- Body -->
                <div style="padding:16px 32px 32px; color:#374151;">
                    <p style="font-size:15px; margin-bottom:4px; text-align:center; color:#111827; font-weight:600;">
                        Interview Scheduled
                    </p>
                    <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
                        Here are your interview details.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Hi ${firstName || "Applicant"},
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        You have been scheduled for an interview for the
                        <strong>${jobTitle}</strong> position at
                        <strong>${companyName}</strong>.
                    </p>

                    <div style="
                        margin:20px 0 12px;
                        padding:16px 18px;
                        border-radius:6px;
                        background-color:#f9fafb;
                        border:1px solid #eaeaea;
                    ">
                        <p style="font-size:13px; font-weight:600; color:#111827; margin:0 0 6px;">Schedule Details</p>
                        <span style="font-size:14px; line-height:1.6; color:#374151; white-space:pre-wrap;">${scheduleSummary}</span>
                    </div>

                    <div style="
                        margin:0 0 20px;
                        padding:16px 18px;
                        border-radius:6px;
                        background-color:#f9fafb;
                        border:1px solid #eaeaea;
                    ">
                        <p style="font-size:13px; font-weight:600; color:#111827; margin:0 0 6px;">Notes</p>
                        <span style="font-size:14px; line-height:1.6; color:#374151; white-space:pre-wrap;">${interviewNotes}</span>
                    </div>

                    <p style="font-size:14px; line-height:1.6;">
                        Please ensure you are available at the scheduled time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.
                    </p>

                    <p style="font-size:14px; margin-bottom:0;">
                        Best regards,<br />
                        <strong>Recruitment Team</strong>
                    </p>
                </div>

                <!-- Footer -->
                <div style="
                    padding:14px;
                    text-align:center;
                    font-size:11px;
                    color:#9ca3af;
                    border-top:1px solid #f3f4f6;
                ">
                    © ${new Date().getFullYear()} REVIER. All rights reserved.
                </div>

            </div>
        </div>
        `
    )
};