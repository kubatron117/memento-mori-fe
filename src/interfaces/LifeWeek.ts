export interface LifeWeek {
  year: number;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  isCurrentWeek: boolean;
  additionalInfo?: string;
  backendId?: number;
  score_satisfaction?: number;
  score_emotional_balance?: number;
  score_productivity?: number;
  score_relationships?: number;
  score_values_alignment?: number;
  total_score?: number | null;
}
