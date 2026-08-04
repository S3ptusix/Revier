export const applyHTML = ({
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
            Application Submitted
          </p>
          <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
            We've received your application.
          </p>

          <p style="font-size:14px; line-height:1.6;">
            Hi ${firstName || "Applicant"},
          </p>

          <p style="font-size:14px; line-height:1.6;">
            Your application for the <strong>${jobTitle}</strong> position at
            <strong>${companyName}</strong> has been successfully submitted.
          </p>

          <p style="font-size:14px; line-height:1.6;">
            Our team will review your application and notify you if you are selected for an interview.
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

export const emailVerificationHTML = ({ otp }) => {
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
        <div style="padding:16px 32px 32px; color:#374151; text-align:center;">
          <p style="font-size:15px; margin-bottom:4px;">Email Verification</p>
          <p style="font-size:14px; color:#6b7280; margin-top:0;">
            Use the code below to verify your email address.
          </p>

          <!-- OTP Box -->
          <div style="
                        margin:24px 0;
                        padding:14px;
                        border-radius:8px;
                        background-color:#f9fafb;
                        border:1px solid #e5e7eb;
                    ">
            <span style="
                            font-size:26px;
                            letter-spacing:6px;
                            font-weight:700;
                            color:#111827;
                        ">
              ${otp}
            </span>
          </div>

          <p style="font-size:13px; color:#6b7280; margin-bottom:4px;">
            This code will expire shortly. Do not share it with anyone.
          </p>
          <p style="font-size:13px; color:#9ca3af; margin-top:0;">
            If you did not request this, you can ignore this email.
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