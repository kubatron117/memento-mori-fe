export interface LifeWeek {
  year: number;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  isCurrentWeek: boolean;
  additionalInfo?: string;
  backendId?: number;
  score_satisfaction?: number | null;
  score_emotional_balance?: number | null;
  score_productivity?: number | null;
  score_relationships?: number | null;
  score_values_alignment?: number | null;
  total_score?: number | null;
}
