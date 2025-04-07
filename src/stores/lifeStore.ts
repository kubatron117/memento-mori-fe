import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import type { LifeWeek } from '@/interfaces/LifeWeek';
import {
  startOfISOWeek,
  endOfISOWeek,
  addWeeks,
  isWithinInterval,
  getISOWeek,
  getISOWeekYear,
} from 'date-fns';
import { WeeksApiService } from '@/api/weeksApiService';
import { useLoginStore } from './loginStore';

function toDate(raw: unknown): Date {
  if (raw instanceof Date) {
    return raw;
  }
  return new Date(String(raw));
}

export const useLifeStore = defineStore('lifeStore', () => {
  const weeks = shallowRef<LifeWeek[]>([]);
  const loginStore = useLoginStore();

  const loadWeeks = async () => {
    const rawBirthDate = loginStore.dateOfBirth;
    const rawDeathDate = loginStore.estimatedLifespan;

    if (!rawBirthDate || !rawDeathDate) {
      console.error('Date of birth or expected date of death is not set.');
      weeks.value = [];
      return;
    }

    const birthDate = toDate(rawBirthDate);
    const deathDate = toDate(rawDeathDate);

    if (isNaN(birthDate.getTime()) || isNaN(deathDate.getTime())) {
      console.error('Invalid date of birth or death.', { birthDate, deathDate });
      weeks.value = [];
      return;
    }

    if (birthDate >= deathDate) {
      console.error('Date of death must be after the date of birth.');
      weeks.value = [];
      return;
    }

    const computedWeeks: LifeWeek[] = [];
    const today = new Date();

    let currentWeekStart = startOfISOWeek(birthDate);
    let currentWeekEnd = endOfISOWeek(currentWeekStart);

    while (currentWeekStart <= deathDate) {
      const adjustedWeekEnd = currentWeekEnd > deathDate ? deathDate : currentWeekEnd;
      const weekNumber = getISOWeek(currentWeekStart);
      const year = getISOWeekYear(currentWeekStart);
      const isCurrent = isWithinInterval(today, {
        start: currentWeekStart,
        end: currentWeekEnd,
      });

      computedWeeks.push({
        year,
        weekNumber,
        startDate: new Date(currentWeekStart),
        endDate: new Date(adjustedWeekEnd),
        isCurrentWeek: isCurrent,
        additionalInfo: undefined,
        score_satisfaction: 0,
        score_emotional_balance: 0,
        score_productivity: 0,
        score_relationships: 0,
        score_values_alignment: 0,
        total_score: null,
      });

      currentWeekStart = addWeeks(currentWeekStart, 1);
      currentWeekEnd = endOfISOWeek(currentWeekStart);
    }


    try {
      const backendWeeks = await WeeksApiService.getWeeksInLives();

      const backendMap = new Map<string, typeof backendWeeks[number]>();
      backendWeeks.forEach((bw) => {
        const key = `${bw.year}-${bw.week_number}`;
        backendMap.set(key, bw);
      });

      computedWeeks.forEach((week) => {
        const key = `${week.year}-${week.weekNumber}`;
        const matchingBackend = backendMap.get(key);
        if (matchingBackend) {
          week.additionalInfo = matchingBackend.memo || undefined;
          week.backendId = matchingBackend.id;
          week.score_satisfaction = matchingBackend.score_satisfaction;
          week.score_emotional_balance = matchingBackend.score_emotional_balance;
          week.score_productivity = matchingBackend.score_productivity;
          week.score_relationships = matchingBackend.score_relationships;
          week.score_values_alignment = matchingBackend.score_values_alignment;
          week.total_score = matchingBackend.total_score;
        }
      });
    } catch (error) {
      console.error('Error loading weeks from BE:', error);
    }

    weeks.value = computedWeeks;
  };

  const updateWeekMemo = async (
    week: LifeWeek,
    newMemo: string,
    scoreSatisfaction: number,
    scoreEmotionalBalance: number,
    scoreProductivity: number,
    scoreRelationships: number,
    scoreValuesAlignment: number
  ) => {
    const now = new Date();
    const startOfCurrentWeek = startOfISOWeek(now);
    const startOfPrevWeek = addWeeks(startOfCurrentWeek, -1);

    if (!week.backendId) {
      console.error('Backend id is missing for this week, memo cannot be updated.');
      throw new Error('Backend id is missing for this week.');
    }

    if (
      week.startDate.getTime() !== startOfCurrentWeek.getTime() &&
      week.startDate.getTime() !== startOfPrevWeek.getTime()
    ) {
      console.error('Memo update is allowed only for the current or previous week.');
      throw new Error('Memo update is allowed only for the current or previous week.');
    }

    try {
      const updatedBackendWeek = await WeeksApiService.updateWeekMemo(
        week.backendId,
        newMemo,
        scoreSatisfaction,
        scoreEmotionalBalance,
        scoreProductivity,
        scoreRelationships,
        scoreValuesAlignment
      );
      const key = `${week.year}-${week.weekNumber}`;
      const idx = weeks.value.findIndex(w => `${w.year}-${w.weekNumber}` === key);
      if (idx !== -1) {
        weeks.value[idx].additionalInfo = updatedBackendWeek.memo || undefined;
        weeks.value[idx].backendId = updatedBackendWeek.id;
        weeks.value[idx].score_satisfaction = updatedBackendWeek.score_satisfaction;
        weeks.value[idx].score_emotional_balance = updatedBackendWeek.score_emotional_balance;
        weeks.value[idx].score_productivity = updatedBackendWeek.score_productivity;
        weeks.value[idx].score_relationships = updatedBackendWeek.score_relationships;
        weeks.value[idx].score_values_alignment = updatedBackendWeek.score_values_alignment;
        weeks.value[idx].total_score = updatedBackendWeek.total_score;
      }
    } catch (error) {
      console.error('Error updating memo:', error);
      throw error;
    }
  };

  const reset = () => {
    weeks.value = [];
  };

  return {
    weeks,
    loadWeeks,
    updateWeekMemo,
    reset
  };
});
