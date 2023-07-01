import mongoose, { Document, Model, Schema } from "mongoose";

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

adminSchema.statics.emailTaken = async function (email: string) {
  const admin = await this.findOne({ email });
  return !!admin;
};

export const AdminModel: adminModelemailTaken = mongoose.model<adminModel, adminModelemailTaken>("adminModel", adminSchema);
