import dotenv from 'dotenv';
const JWT_SECRET_KEY = process.env.JWT_SERCRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const PORT = process.env.PORT;
const CRYPTO = process.env.CRYPTO;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
const NODEMAILER_USERNAME = process.env.NODEMAILER_USERNAME;
const DATABASE_URL = process.env.DATABASE_URL;

dotenv.config();

export const ENV = {
  JWT: {
    secret: JWT_SECRET_KEY,
    expires: JWT_EXPIRES_IN,
  },

  PORT: {
    port: PORT,
  },
  NODEMAILER: {
    password: NODEMAILER_PASS,
    username: NODEMAILER_USERNAME,
  },

  DATABASE: {
    url: DATABASE_URL,
  },
};
