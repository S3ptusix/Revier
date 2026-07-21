// import nodemailer from 'nodemailer';

// export const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD,
//   },
// });

// export const sendMail = async ({ to, subject, html }) => {
//   return transporter.sendMail({
//     from: process.env.EMAIL,
//     to,
//     subject,
//     html
//   });
// };

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    console.log("RESEND RESPONSE:", response); // 👈 ADD THIS

    return response;
  } catch (error) {
    console.error("RESEND ERROR:", error);
    throw error;
  }
};