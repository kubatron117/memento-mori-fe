// src/interfaces/LifeWeek.ts
export interface LifeWeek {
  year: number;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  isCurrentWeek: boolean;
  additionalInfo?: string;
}
