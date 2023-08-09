import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const PORT = process.env.PORT;
const CRYPTO = process.env.CRYPTO;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;
const NODEMAILER_USERNAME = process.env.NODEMAILER_USERNAME;
const CLOUDIANRY_CLOUD_NAME = process.env.CLOUDIANRY_CLOUD_NAME;
const CLOUDIANRY_API_KEY = process.env.CLOUDIANRY_API_KEY;
const CLOUDIANRY_API_SECRET = process.env.CLOUDIANRY_API_SECRET;
const NODE_ENV = process.env.NODE_ENV;

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
  CLOUDIANRY: {
    NAME: CLOUDIANRY_CLOUD_NAME,
    KEY: CLOUDIANRY_API_KEY,
    SECRET: CLOUDIANRY_API_SECRET,
  },
  MODE: {
    DEVELOPMENT: NODE_ENV,
  },
};
