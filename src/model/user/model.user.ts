import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface UserModel extends Document {
  _id?: string;
  first_name: string;
  email: string;
  password: string;
  last_name: string;
  password_change_at: Date;
  password_reset_token: any;
  password_reset_expires: any;
  active: boolean;
  isAccountVerified: boolean;
  accountVerificationToken?: string;
  accountVerificationTokenExpires?: Date;
  passwordChangeAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Custom methods
  createAccountVerificationToken: () => Promise<string>;
  isPasswordMatched: (userPassword: string) => Promise<boolean>;
  createPasswordResetToken: () => Promise<string>;
  changePasswordAfter: (JWTTimeStamps: any) => boolean;
  // createPasswordResetToken: () => string;
}

interface UserModelStatic extends Model<UserModel> {
  // Add any static methods here if needed
}

const userSchema = new Schema<UserModel>(
  {
    first_name: {
      required: [true, 'First name is required'],
      type: String,
    },

    last_name: {
      required: [true, 'Last name is required'],
      type: String,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    accountVerificationToken: {
      type: String,
    },

    accountVerificationTokenExpires: {
      type: Date,
    },

    passwordChangeAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: {
      type: Date,
    },

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

userSchema.pre<UserModel>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

userSchema.statics.emailTaken = async function (
  email: string
): Promise<boolean> {
  const user = await this.findOne({ email });
  return !!user;
};

userSchema.methods.createAccountVerificationToken =
  async function (): Promise<string> {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    this.accountVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;

    return verificationToken;
  };

  userSchema.methods.isPasswordMatched = async function (userPassword: string): Promise<boolean> {
    return await bcrypt.compare(userPassword, this.password);
  };

  userSchema.methods.createPasswordResetToken = async function (): Promise<string> {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
  };



export const UserModel: UserModelStatic = mongoose.model<
  UserModel,
  UserModelStatic
>('User', userSchema);
