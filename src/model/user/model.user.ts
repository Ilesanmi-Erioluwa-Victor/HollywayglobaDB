import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface UserModel extends Document {
  _id?: string;
  firstName: string;
  email: string;
  password: string;
  lastName: string;
  profilePhoto: string;
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
  emailTaken: () => Promise<boolean>;
}

const userSchema = new Schema<UserModel>(
  {
    firstName: {
      required: [true, 'First name is required'],
      type: String,
    },

    lastName: {
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

    profilePhoto: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png',
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
    
    console.log(verificationToken)
    return verificationToken;
  };

userSchema.methods.isPasswordMatched = async function (
  userPassword: string
): Promise<boolean> {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.createPasswordResetToken =
  async function (): Promise<string> {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
  };

export const UserModel = mongoose.model<UserModel>('User', userSchema);
