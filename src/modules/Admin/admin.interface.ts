export interface signupAdmin {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface loginAdminI {
  role?: string;
  id: string;
  name: string;
  email: string;
  password: string;
  isAccountVerified: boolean;
  accountVerificationToken: string;
  accountVerificationTokenExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  v?: number;
}
