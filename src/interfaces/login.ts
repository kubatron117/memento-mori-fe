// interfaces/login.ts
export interface AccountCredentials {
  email: string;
  password: string;
}

export interface AccountInfo {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  estimatedLifespan: Date;
}

export interface AccountVerification {
  key: string;
  'first_name': string;
  'last_name': string;
  password: string;
  'password-confirm': string;
}

export interface AccountRegistration {
  email: string;
  password: string;
  'password-confirm': string;
}


export interface AccountEmailRequest {
  email: string;
}

export interface AccountResetPassword {
  key: string;
  password: string;
  'password-confirm': string;
}

export interface AccountChangePassword {
  password: string;
  'new-password': string;
  'password-confirm': string;
}
