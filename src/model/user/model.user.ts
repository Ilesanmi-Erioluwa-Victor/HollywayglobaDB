import mongoose, { Document, Model, Schema } from "mongoose";

interface userModel extends Document {
  _id?: string;
  first_name: string;
  email: string;
  password: string;
  last_name: string;
}


const userSchema = new Schema<userModel>(
  {
    first_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);


export const userModel  = mongoose.model<userModel>("userModel", userSchema);
