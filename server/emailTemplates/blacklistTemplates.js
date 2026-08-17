export const blacklistHTML = ({
    firstName = "Applicant",
    jobTitle = "the position",
    companyName = "the company",
    reason = "The applicant did not meet the required standards during the recruitment process.",
    contactAdmin
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
                    <h1 style="
                        margin:0;
                        color:#111827;
                        font-size:18px;
                        font-weight:600;
                    ">
                        REVIER
                    </h1>
                </div>

                <!-- Body -->
                <div style="padding:16px 32px 32px; color:#374151;">
                    <p style="font-size:15px; margin-bottom:4px; text-align:center; color:#111827; font-weight:600;">
                        Application Restricted
                    </p>
                    <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
                        An update regarding your application status.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Hi ${firstName},
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Thank you for your interest in the <strong>${jobTitle}</strong> position at
                        <strong>${companyName}</strong>.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        After review, we regret to inform you that your application has been restricted
                        for the following reason:
                    </p>

                    <!-- Reason -->
                    <div style="
                        margin:20px 0;
                        padding:16px 18px;
                        border-radius:6px;
                        background-color:#f9fafb;
                        border:1px solid #eaeaea;
                    ">
                        <span style="font-size:14px; line-height:1.6; color:#374151; white-space:pre-wrap;">${reason}</span>
                    </div>

                    <p style="font-size:14px; line-height:1.6;">
                        As a result, you are currently not eligible to apply for opportunities within this company.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        ${contactAdmin}
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Thank you for your understanding.
                    </p>

                    <p style="font-size:14px; margin-bottom:0;">
                        Best regards,<br />
                        <strong>${companyName} Recruitment Team</strong>
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