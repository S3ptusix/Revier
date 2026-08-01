import { formatDateTime } from "../utils/format.js";

export const failedInterviewHTML = ({
  firstName,
  jobTitle,
  companyName,
  rejectedReason
}) => {
  return (
    `
      <div style="font-family: Arial, sans-serif; color:#111827; line-height:1.6;">

        <p>Hi ${firstName || "Applicant"},</p>

        <p>
          Thank you for taking the time to interview for the 
          <strong>${jobTitle}</strong> position at 
          <strong>${companyName}</strong>.
        </p>

        <p>
          After careful review, we regret to inform you that we will not be proceeding with your application at this time.
        </p>

        ${rejectedReason ? `
          <p>
            <strong>Feedback:</strong> ${rejectedReason}
          </p>
        ` : ""}

        <p>
          We appreciate your interest and encourage you to apply again in the future.        
        </p>

        <p style="margin-top: 20px;">
          Regards,<br/>
          Recruitment Team
        </p>

      </div>
    `
  )
};

export const rescheduleInterviewHTML = ({
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
                You have been rescheduled for an interview for the 
                <strong>${jobTitle}</strong> position at 
                <strong>${companyName}</strong>.
            </p>

            <p style="margin-top:15px;">
                <strong>Updated Details:</strong><br/>
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

export const forOrientationHTML = ({
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

      <p> Hi ${firstName || "Applicant"},</p>

      <p>
        You have successfully passed your interview for the 
        <strong>${jobTitle}</strong> position at 
        <strong>${companyName}</strong>.
      </p>

      <p>You are scheduled for an orientation:</p>

      <p><strong>Event:</strong> ${eventTitle}</p>
      <p><strong>Date & Time:</strong> ${formatDateTime(eventAt)}</p>
      <p><strong>Location:</strong> ${eventLocation}</p>

      ${eventNote
      ? `<p><strong>Notes:</strong><br/><span style="white-space: pre-line;">${eventNote}</span></p>`
      : ""
    }

      <p style="margin-top:20px;">
        Please attend the session on time. Candidates who are present will proceed with hiring, 
        while those who are unable to attend will be considered not selected.
      </p>

      <p style="margin-top:20px;">
        Best regards,<br/>
        Recruitment Team
      </p>

    </div>
  `
  )
};