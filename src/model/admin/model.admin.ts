import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";
interface adminModel extends Document {
  email: string;
  username: string;
  password: string;
}

interface adminModelemailTaken extends Model<adminModel> {
  emailTaken: (email: string) => Promise<boolean>;
}

const adminSchema = new Schema<adminModel, adminModelemailTaken>(
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

adminSchema.pre<adminModel>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

adminSchema.statics.emailTaken = async function (email: string) {
  const admin = await this.findOne({ email });
  return !!admin;
};

export const AdminModel: adminModelemailTaken = mongoose.model<
  adminModel,
  adminModelemailTaken
>("adminModel", adminSchema);
