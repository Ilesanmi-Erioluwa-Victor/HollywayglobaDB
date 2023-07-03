import mongoose, { Document, Model, Schema } from "mongoose";

interface userModel extends Document {
  email: string;
  username: string;
  password: string;
}


const userSchema = new Schema<userModel>(
  {
    email: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);


export const userModel  = mongoose.model<userModel>("userModel", userSchema);
