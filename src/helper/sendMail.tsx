import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

export const sendMail = () => {
  var transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: `${process.env.NODEMAILER_USERNAME}`,
      pass: `${process.env.NODEMAILER_PASS}`,
    },
  });
};
