import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendMail = async ({to, subject, html }) => {
  return transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html
  });
};
