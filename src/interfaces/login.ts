// interfaces/login.ts
export interface AccountCredentials {
  email: string;
  password: string;
}

export interface AccountInfo {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  estimatedLifespan: Date;
}

export interface AccountVerification {
  key: string;
}

export interface AccountRegistration {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  'password-confirm': string;
  agree_to_terms: boolean;
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
