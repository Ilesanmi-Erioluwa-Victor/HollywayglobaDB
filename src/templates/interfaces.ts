export interface UserI {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountVerificationToken: string;
}

export interface userInfoI {
  email?: string;
  token: string;
  userId?: string;
}
export interface AdminI {
  id: string;
  name: string;
  email: string;
  accountVerificationToken: string;
}

export interface adminInfoI {
  email?: string;
  token: string;
  id?: string;
}
