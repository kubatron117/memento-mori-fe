import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { z } from 'zod';
import { BASE_API_URL } from '@/constants/apiUrl';

const LifeWeekBackendSchema = z.object({
  id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  week_number: z.number(),
  year: z.number(),
  memo: z.string().nullable(),
  total_score: z.number().nullable(),
  account_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  url: z.string(),
  score_satisfaction: z.number().nullable().optional(),
  score_emotional_balance: z.number().nullable().optional(),
  score_productivity: z.number().nullable().optional(),
  score_relationships: z.number().nullable().optional(),
  score_values_alignment: z.number().nullable().optional(),
});


const LifeWeekBackendArraySchema = z.array(LifeWeekBackendSchema);

const LifeWeekUpdateResponseSchema = z.object({
  id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  week_number: z.number(),
  year: z.number(),
  memo: z.string().nullable(),
  score_satisfaction: z.number().nullable(),
  score_emotional_balance: z.number().nullable(),
  score_productivity: z.number().nullable(),
  score_relationships: z.number().nullable(),
  score_values_alignment: z.number().nullable(),
  total_score: z.number().nullable(),
  account_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});


const backendApi = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

export class WeeksApiService {
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

  static async getWeeksInLives(): Promise<z.infer<typeof LifeWeekBackendArraySchema>> {
    const endpoint = '/weeks_in_lives';
    const data = await this.handleRequest(backendApi.get(endpoint), endpoint);
    return this.validate(LifeWeekBackendArraySchema, data);
  }

  static async updateWeekMemo(
    backendId: number,
    memo: string,
    scoreSatisfaction: number,
    scoreEmotionalBalance: number,
    scoreProductivity: number,
    scoreRelationships: number,
    scoreValuesAlignment: number
  ): Promise<z.infer<typeof LifeWeekUpdateResponseSchema>> {
    const endpoint = `/weeks_in_lives/memo/${backendId}`;
    const payload = {
      weeks_in_life: {
        memo,
        score_satisfaction: scoreSatisfaction,
        score_emotional_balance: scoreEmotionalBalance,
        score_productivity: scoreProductivity,
        score_relationships: scoreRelationships,
        score_values_alignment: scoreValuesAlignment,
      },
    };
    const data = await this.handleRequest(backendApi.put(endpoint, payload), endpoint);
    return this.validate(LifeWeekUpdateResponseSchema, data);
  }
}
