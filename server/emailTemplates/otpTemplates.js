// Shared OTP email template used for account verification, login, and
// password-reset codes. Kept visually consistent with the rest of the
// REVIER email suite (see userAccountCreatedHTML): quiet, single-column,
// black-on-white, no gradients, shadows, or emoji.
export const otpEmailHTML = ({ firstName, otp, expiresInMinutes = 5, heading = 'Verification Code', intro }) => {

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
                        ${heading}
                    </p>
                    <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
                        Enter this code to continue.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Hello ${firstName || ''},
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        ${intro || 'Use the code below to verify it\u2019s you.'}
                    </p>

                    <!-- OTP Code -->
                    <div style="
                        margin:24px 0;
                        padding:18px;
                        text-align:center;
                        border-radius:6px;
                        background-color:#f9fafb;
                        border:1px solid #eaeaea;
                    ">
                        <span style="
                            font-family:'Courier New', monospace;
                            font-size:28px;
                            letter-spacing:8px;
                            font-weight:700;
                            color:#111827;
                        ">
                            ${otp}
                        </span>
                    </div>

                    <p style="font-size:13px; color:#6b7280; line-height:1.6; text-align:center; margin-top:0;">
                        This code expires in ${expiresInMinutes} minutes.
                    </p>

                    <p style="font-size:13px; color:#6b7280; line-height:1.6;">
                        For your security, don't share this code with anyone, including REVIER staff. If you didn't request it, you can safely ignore this email.
                    </p>

                    <p style="font-size:14px; margin-bottom:0;">
                        Regards,<br />
                        <strong>REVIER Team</strong>
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

export const userAccountCreatedHTML = ({ firstName }) => {

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
                    <p style="font-size:15px; margin-bottom:4px; text-align:center;">Account Created</p>
                    <p style="font-size:14px; color:#6b7280; margin-top:0; text-align:center;">
                        Welcome, your account is ready to use.
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Hello ${firstName || ''},
                    </p>

                    <p style="font-size:14px; line-height:1.6;">
                        Your account has been successfully created and verified. You can now log in to REVIER and start exploring available opportunities.
                    </p>

                    <!-- CTA Button -->
                    <div style="text-align:center; margin:28px 0;">
                        <a href="${process.env.CLIENT_URL}" style="
                            display:inline-block;
                            padding:12px 28px;
                            background-color:#111827;
                            color:#ffffff;
                            text-decoration:none;
                            border-radius:6px;
                            font-size:14px;
                            font-weight:600;
                        ">
                            Go to Dashboard
                        </a>
                    </div>

                    <p style="font-size:13px; color:#6b7280; line-height:1.6;">
                        If you did not create this account, please contact our support team immediately.
                    </p>

                    <p style="font-size:14px; margin-bottom:0;">
                        Regards,<br />
                        <strong>REVIER Team</strong>
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