export const changeEventHTML = ({
  firstName,
  jobTitle,
  companyName,
  scheduleSummary,
  eventNote
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
            Orientation Updated
          </p>
          <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
            Your orientation schedule has changed.
          </p>

          <p style="font-size:14px; line-height:1.6;">
            Hi ${firstName || "Applicant"},
          </p>

          <p style="font-size:14px; line-height:1.6;">
            We would like to inform you that your orientation schedule for the
            <strong>${jobTitle}</strong> position at
            <strong>${companyName}</strong> has been updated.
          </p>

          <div style="
              margin:20px 0 12px;
              padding:16px 18px;
              border-radius:6px;
              background-color:#f9fafb;
              border:1px solid #eaeaea;
          ">
            <p style="font-size:13px; font-weight:600; color:#111827; margin:0 0 6px;">Updated Schedule Details</p>
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
            <span style="font-size:14px; line-height:1.6; color:#374151; white-space:pre-wrap;">${eventNote}</span>
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

export const hiredHTML = ({
  firstName,
  jobTitle,
  companyName,

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
              <p style="font-size:15px; margin-bottom:4px; text-align:center; color:#10b981; font-weight:600;">
                Hiring Confirmation
              </p>
              <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
                Congratulations on your new role.
              </p>

              <p style="font-size:14px; line-height:1.6;">
                Hi ${firstName || "Applicant"},
              </p>

              <p style="font-size:14px; line-height:1.6;">
                We are pleased to inform you that you have been successfully selected for the
                <strong>${jobTitle}</strong> position at
                <strong>${companyName}</strong>.
              </p>

              <p style="font-size:14px; line-height:1.6;">
                This opportunity has been facilitated through our recruitment process, and we are confident that your qualifications and experience make you a strong fit for the role.
              </p>

              <p style="font-size:14px; line-height:1.6;">
                The company will be reaching out to you shortly with further details regarding your onboarding, including your official start date and next steps.
              </p>

              <p style="font-size:14px; line-height:1.6;">
                Congratulations on your successful application — we wish you great success in your new role!
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
}

export const absentOnOrientationHTML = ({
  firstName,
  jobTitle,
  companyName
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
                Orientation Absence
              </p>
              <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
                An update regarding your application status.
              </p>

              <p style="font-size:14px; line-height:1.6;">
                Hi ${firstName || "Applicant"},
              </p>

              <p style="font-size:14px; line-height:1.6;">
                We would like to inform you that you were marked as <strong>Absent</strong> during your scheduled orientation
                for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
              </p>

              <p style="font-size:14px; line-height:1.6;">
                As attendance in the orientation is a required step in the hiring process, your application will no longer proceed at this time.
              </p>

              <p style="font-size:14px; line-height:1.6;">
                We appreciate your time and interest in this opportunity, and we encourage you to apply again in the future.
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
}

export const addToEventHTML = ({
  firstName,
  jobTitle,
  companyName,
  scheduleSummary,
  eventNote
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
            You’ve Been Added to an Event
          </p>
          <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
            Here are your orientation details.
          </p>

          <p style="font-size:14px; line-height:1.6;">
            Hi ${firstName || "Applicant"},
          </p>

          <p style="font-size:14px; line-height:1.6;">
            You have been successfully added to an event for the 
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
            <span style="font-size:14px; line-height:1.6; color:#374151; white-space:pre-wrap;">${eventNote}</span>
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

export const removedFromEventHTML = ({
  firstName,
  jobTitle,
  companyName,
  eventTitle
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
            Orientation Update
          </p>
          <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
            You've been removed from an orientation session.
          </p>

          <p style="font-size:14px; line-height:1.6;">
            Hi ${firstName || "Applicant"},
          </p>

          <p style="font-size:14px; line-height:1.6;">
            You have been removed from the <strong>"${eventTitle}"</strong> orientation
            for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
          </p>

          <p style="font-size:14px; line-height:1.6;">
            Please check your dashboard for updated scheduling details. If a new orientation date is available, you'll be notified as soon as it's confirmed.
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
  );
};

{/* <p style="font-size:14px; line-height:1.6;">
  If you have any questions, feel free to reach out to our recruitment team.
</p> */}