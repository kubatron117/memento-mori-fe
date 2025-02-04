// accountLoginApiService.ts
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { z } from 'zod'
import { BACKEND_API_URL, BASE_API_URL } from '@/constants/apiUrl'
import type {
  AccountChangePassword,
  AccountCredentials,
  AccountEmailRequest,
  AccountInfo,
  AccountResetPassword,
  AccountVerification,
  AccountRegistration
} from '@/interfaces/login'

const PostAccountCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

const PostVerifyAccountCredentialsSchema = z.object({
  key: z.string().min(1).max(255),
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  password: z.string().min(12).max(64),
  'password-confirm': z.string().min(12).max(64),
})

const PostAccountEmailRequestSchema = z.object({
  email: z.string().email(),
})

const PostVerifyAccountPasswordResetSchema = z.object({
  key: z.string().min(1).max(255),
  password: z.string().min(12).max(64),
  'password-confirm': z.string().min(12).max(64),
})

const PostAccountRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(64),
  'password-confirm': z.string().min(8).max(64),
})

const PostVerifyAccountPasswordChangeSchema = z.object({
  password: z.string(),
  'new-password': z.string().min(12).max(64),
  'password-confirm': z.string().min(12).max(64),
})

const backendApi = axios.create({
  baseURL: BACKEND_API_URL
})

const accountApi = axios.create({
  baseURL: `${BASE_API_URL}/accounts`
})

export class AccountLoginApiService {
  private static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation error: ${error.errors.map((e) => e.message).join(', ')}`
        )
      }
      throw error
    }
  }

  private static async handleRequest<T>(
    request: Promise<AxiosResponse<T>>,
    endpoint: string
  ): Promise<AxiosResponse<T>> {
    try {
      return await request
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`${error.message} [${endpoint}]`)
      }
      throw error
    }
  }

  static async login(account: AccountCredentials): Promise<number> {
    const validatedData = this.validate(PostAccountCredentialsSchema, account)
    const endpoint = '/login'
    const response = await this.handleRequest(
      backendApi.post(endpoint, validatedData),
      endpoint
    )
    return response.status
  }

  static async logout(): Promise<number> {
    const endpoint = '/logout'
    const response = await this.handleRequest(
      backendApi.post(endpoint, {}),
      endpoint
    )
    return response.status
  }

  static async registration(accountRegistration: AccountRegistration): Promise<number> {
    const validatedData = this.validate(PostAccountRegistrationSchema, accountRegistration)
    const endpoint = '/create-account'
    const response = await this.handleRequest(
      backendApi.post(endpoint, validatedData),
      endpoint
    )

    console.log(response);

    return response.status
  }

  static async getAccountInfo(): Promise<AccountInfo> {
    const endpoint = '/info'
    const response = await this.handleRequest(
      accountApi.get<AccountInfo>(endpoint),
      endpoint
    )
    return response.data
  }

  static async verifyAccount(accountVerification: AccountVerification): Promise<number> {
    const validatedData = this.validate(PostVerifyAccountCredentialsSchema, accountVerification)
    const endpoint = '/verify-account'
    const response = await this.handleRequest(
      backendApi.post(endpoint, validatedData),
      endpoint
    )
    return response.status
  }

  static async resetPasswordRequest(accountEmailRequest: AccountEmailRequest): Promise<number> {
    const validatedData = this.validate(PostAccountEmailRequestSchema, accountEmailRequest)
    const endpoint = '/reset-password-request'
    const response = await this.handleRequest(
      backendApi.post(endpoint, validatedData),
      endpoint
    )
    return response.status
  }

  static async resetPassword(accountPasswordReset: AccountResetPassword): Promise<number> {
    const validatedData = this.validate(PostVerifyAccountPasswordResetSchema, accountPasswordReset)
    const endpoint = '/reset-password'
    const response = await this.handleRequest(
      backendApi.post(endpoint, validatedData),
      endpoint
    )
    return response.status
  }

  static async verifyAccountResend(accountEmailRequest: AccountEmailRequest): Promise<number> {
    const validatedData = this.validate(PostAccountEmailRequestSchema, accountEmailRequest)
    const endpoint = '/verify-account-resend'
    const response = await this.handleRequest(
      backendApi.post(endpoint, validatedData),
      endpoint
    )
    return response.status
  }

  static async changePassword(accountPasswordChange: AccountChangePassword): Promise<number> {
    const validatedData = this.validate(PostVerifyAccountPasswordChangeSchema, accountPasswordChange)
    const endpoint = '/change-password'
    const response = await this.handleRequest(
      backendApi.post(endpoint, validatedData),
      endpoint
    )
    return response.status
  }
}
