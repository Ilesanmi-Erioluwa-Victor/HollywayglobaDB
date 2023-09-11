export interface signupUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  profilePhoto?: string;
}

export interface loginUserI {
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

export interface address {
  deliveryAddress?: string;
  additionalInfo?: string;
  region?: string;
  city?: string;
  phone?: string;
  additionalPhone?: string;
}

export interface review {
  text: string;
  rating: number;
}
