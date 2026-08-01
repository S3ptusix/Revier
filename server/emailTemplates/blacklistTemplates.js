export const blacklistHTML = ({
    firstName = "Applicant",
    jobTitle = "the position",
    companyName = "the company",
    reason = "The applicant did not meet the required standards during the recruitment process."
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
            After review, we regret to inform you that your application has been restricted 
            for the following reason:
            </p>

            <p>
            ${reason}
            </p>

            <p>
            As a result, you are currently not eligible to apply for opportunities within this company.
            </p>

            <p style="margin-top:20px;">
            Thank you for your understanding.
            </p>

            <p style="margin-top:20px;">
            Best regards,<br/>
            ${companyName} Recruitment Team
            </p>
        </div>
        `
    )
};
