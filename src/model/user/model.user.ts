import mongoose, { Document, Model, Schema } from 'mongoose';

interface userModel extends Document {
  _id?: string;
  first_name: string;
  email: string;
  password: string;
  last_name: string;
  password_change_at: Date;
  password_reset_token: string;
  password_reset_expires: Date;
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
    password_change_at: Date,
    password_reset_token: String,
    password_reset_expires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.methods.changePasswordAfter = function (JWTTimeStamps: any) {
  if (this.password_change_at) {
    const changeTime_milliseconds = String(this.password_change_at.getTime() / 1000);
    const changeTimeStamp: any = parseInt(changeTime_milliseconds, 10);

    return JWTTimeStamps < changeTimeStamp;
  }

  // false means not change
  return false;
};

export const userModel = mongoose.model<userModel>('userModel', userSchema);
