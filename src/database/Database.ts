import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

type MongoDBType = string | undefined;
const MONGODB_KEY: MongoDBType = process.env.MONGODB_KEY;

interface connectTypes {}

export const connectFunction = async () => {
  if (MONGODB_KEY === undefined) {
    console.log('mongoose key not set');
  } else {
    const conn = await mongoose.connect(MONGODB_KEY, <connectTypes>{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (conn) console.log('connected to the database');
    return conn;
  }
};

