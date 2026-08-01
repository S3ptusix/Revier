export const changeEventHTML = ({
  firstName,
  jobTitle,
  companyName,
  eventTitle,
  eventAt,
  eventLocation,
  eventNote
}) => {

  return (
    `
    <div style="font-family: Arial, sans-serif; color:#111827; line-height:1.6;">

        <p>Hi ${firstName || "Applicant"},</p>

        <p>
            We would like to inform you that your orientation schedule for the 
            <strong>${jobTitle}</strong> position at 
            <strong>${companyName}</strong> has been updated.
        </p>

        <p><strong>Updated Orientation Details:</strong></p>

        <p><strong>Event:</strong> ${eventTitle}</p>
        <p><strong>Date & Time:</strong> ${formatDateTime(eventAt)}</p>
        <p><strong>Location:</strong> ${eventLocation}</p>

        ${
        eventNote
        ? `<p><strong>Notes:</strong><br/><span style="white-space: pre-line;">${eventNote}</span></p>`
        : ""
        }

        <p style="margin-top:20px;">
            Please make sure to take note of the updated schedule and attend on time. 
            Candidates who are present will proceed with the hiring process, while those 
            who are unable to attend may be considered not selected.
        </p>

        <p style="margin-top:20px;">
            Best regards,<br/>
            Recruitment Team
        </p>

    </div>

  `
)
};

export const hiredHTML = ({
    firstName,
    jobTitle,
    companyName,
    
}) => {

    return(
        `
       <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">

            <h2 style="color: #10b981;">Hiring Confirmation</h2>

            <p>Hi ${firstName || "Applicant"},</p>

            <p>
                We are pleased to inform you that you have been successfully selected for the 
                <strong>${jobTitle}</strong> position at 
                <strong>${companyName}</strong>.
            </p>

            <p>
                This opportunity has been facilitated through our recruitment process, and we are confident that your qualifications and experience make you a strong fit for the role.
            </p>

            <p>
                The company will be reaching out to you shortly with further details regarding your onboarding, including your official start date and next steps.
            </p>

            <p>
                Congratulations on your successful application — we wish you great success in your new role!
            </p>

            <br/>

            <p style="margin-top:20px;">
                Best regards,<br/>
                Recruitment Team
            </p>

        </div>

        `
    )
}

export const absentOnOrientationHTML = ({
    firstName,
    jobTitle,
    companyName
}) => {

    return(
        `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">

            <p>Hi ${firstName || "Applicant"},</p>

            <p>
                We would like to inform you that you were marked as <strong>Absent</strong> during your scheduled orientation 
                for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
            </p>

            <p>
                As attendance in the orientation is a required step in the hiring process, your application will no longer proceed at this time.
            </p>

            <p>
                We appreciate your time and interest in this opportunity, and we encourage you to apply again in the future.
            </p>

            <br/>

            <p style="margin-top:20px;">
                Best regards,<br/>
                Recruitment Team
            </p>

        </div>
        `
    )
}