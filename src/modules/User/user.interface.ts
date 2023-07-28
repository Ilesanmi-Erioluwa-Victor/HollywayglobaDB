export interface signupUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface loginUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  isBlocked: boolean;
  refreshToken?: string;
  active: boolean;
  profilePhoto: string;
  isAccountVerified: boolean;
  accountVerificationToken: string;
  accountVerificationTokenExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  v?: number;
}
