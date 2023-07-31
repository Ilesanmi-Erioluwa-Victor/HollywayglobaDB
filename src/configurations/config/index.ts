import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const PORT = process.env.PORT;
const CRYPTO = process.env.CRYPTO;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
const NODEMAILER_USERNAME = process.env.NODEMAILER_USERNAME;



export const ENV = {
  JWT: {
    SECRET: JWT_SECRET_KEY,
    EXPIRES: JWT_EXPIRES_IN,
  },

  PORT: {
    PORT: PORT,
  },
  NODEMAILER: {
    PASSWORD: NODEMAILER_PASS,
    USERNAME: NODEMAILER_USERNAME,
  },
};
