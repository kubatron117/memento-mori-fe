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
  key: z.string().min(1).max(255)
})

const PostAccountEmailRequestSchema = z.object({
  email: z.string().email()
})

const PostVerifyAccountPasswordResetSchema = z.object({
  key: z.string().min(1).max(255),
  password: z.string().min(8).max(64),
  'password-confirm': z.string().min(8).max(64)
})

const PostAccountRegistrationSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(64),
  'password-confirm': z.string().min(8).max(64),
  agree_to_terms: z.boolean().default(true),
})

const PostVerifyAccountPasswordChangeSchema = z.object({
  password: z.string(),
  'new-password': z.string().min(8).max(64),
  'password-confirm': z.string().min(8).max(64)
})

const PutAccountDatesDataSchema = z.object({
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Neplatný formát data, očekává se YYYY-MM-DD"),
  estimated_lifespan: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Neplatný formát data, očekává se YYYY-MM-DD")
})

const backendApi = axios.create({
  baseURL: BACKEND_API_URL,
  withCredentials: true
})

const accountApi = axios.create({
  baseURL: `${BASE_API_URL}/accounts`,
  withCredentials: true
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

    console.log(validatedData)

    const endpoint = '/create-account'
    const response = await this.handleRequest(
      backendApi.post(endpoint, validatedData),
      endpoint
    )
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

  static async updateDates(dates: { date_of_birth: string; estimated_lifespan: string }): Promise<AccountInfo> {
    const validatedData = this.validate(PutAccountDatesDataSchema, dates)
    const endpoint = '/dates'
    const response = await this.handleRequest(
      accountApi.put(endpoint, { account: validatedData }),
      endpoint
    )
    return response.data
  }
}
