// src/services/LocationsApiService.ts
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { z } from 'zod';
import { BASE_API_URL } from '@/constants/apiUrl';

const LocationSchema = z.object({
  id: z.number(),
  location: z.string(),
  iso3_code: z.string(),
  iso2_code: z.string(),
  loc_type_id: z.number(),
  loc_type_name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  url: z.string(),
});

export type Location = z.infer<typeof LocationSchema>;

const LocationArraySchema = z.array(LocationSchema);

const backendApi = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

export class LocationsApiService {
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

  static async getLocations(): Promise<Location[]> {
    const endpoint = '/locations?q[loc_type_id_eq]=4';
    const data = await this.handleRequest(backendApi.get(endpoint), endpoint);
    return this.validate(LocationArraySchema, data);
  }
}
