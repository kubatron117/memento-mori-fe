// src/services/LifeExpectanciesApiService.ts
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { z } from 'zod';
import { BASE_API_URL } from '@/constants/apiUrl';

const LifeExpectancySchema = z.object({
  id: z.number(),
  birth_year: z.number(),
  life_expectancy_both: z.number(),
  life_expectancy_male: z.number(),
  life_expectancy_female: z.number(),
  loc_id: z.number(),
  location_id: z.number(),
  variant_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  url: z.string(),
});

export type LifeExpectancy = z.infer<typeof LifeExpectancySchema>;

const LifeExpectancyArraySchema = z.array(LifeExpectancySchema);

const backendApi = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

export interface LifeExpectanciesFilters {
  birth_year_eq?: number;
  location_id_eq?: number;
}

export class LifeExpectanciesApiService {
  private static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation error: ${error.errors.map((e) => e.message).join(', ')}`
        );
      }
      throw error;
    }
  }

  private static async handleRequest<T>(
    request: Promise<AxiosResponse<T>>,
    endpoint: string
  ): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`${error.message} [${endpoint}]`);
      }
      throw error;
    }
  }

  static async getLifeExpectancies(filters: LifeExpectanciesFilters): Promise<LifeExpectancy[]> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        params.append(`q[${key}]`, String(value));
      }
    }
    const endpoint = `/life_expectancies?${params.toString()}`;
    const data = await this.handleRequest(backendApi.get(endpoint), endpoint);
    return this.validate(LifeExpectancyArraySchema, data);
  }
}
