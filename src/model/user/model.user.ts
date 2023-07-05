import mongoose, { Document, Model, Schema } from 'mongoose';
import crypto from 'crypto';

interface UserModel extends Document {
  _id?: string;
  first_name: string;
  email: string;
  password: string;
  last_name: string;
  password_change_at: Date;
  password_reset_token: any;
  password_reset_expires: Date;
  active: boolean;
  changePasswordAfter: (JWTTimeStamps: any) => boolean;
  createPasswordResetToken: () => string;
}

interface UserModelStatic extends Model<UserModel> {
  // Add any static methods here if needed
}

const userSchema = new Schema<UserModel>(
  {
    first_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    password_change_at: Date,
    password_reset_token: String,
    password_reset_expires: Date,
    active: {
      type: Boolean,
      default: true,
    },
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
    const changeTimeMilliseconds = this.password_change_at.getTime() / 1000;
    const changeTimeStamp = parseInt(String(changeTimeMilliseconds), 10);

    return JWTTimeStamps < changeTimeStamp;
  }

  // false means not change
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.password_reset_token);

  this.password_reset_expires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const UserModel: UserModelStatic = mongoose.model<
  UserModel,
  UserModelStatic
>('User', userSchema);
