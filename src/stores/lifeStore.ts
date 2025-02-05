// src/stores/lifeStore.ts
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

export const useLifeStore = defineStore('lifeStore', () => {
  const weeks = shallowRef<LifeWeek[]>([]);
  const loginStore = useLoginStore();

  const loadWeeks = async () => {
    const rawBirthDate = loginStore.dateOfBirth;
    const rawDeathDate = loginStore.estimatedLifespan;

    console.log('rawBirthDate:', rawBirthDate, typeof rawBirthDate);
    console.log('rawDeathDate:', rawDeathDate, typeof rawDeathDate);

    if (!rawBirthDate || !rawDeathDate) {
      console.error('Datum narození nebo očekávané datum úmrtí není nastaveno.');
      weeks.value = [];
      return;
    }

    const birthDate =
      rawBirthDate instanceof Date ? rawBirthDate : new Date(rawBirthDate);
    const deathDate =
      rawDeathDate instanceof Date ? rawDeathDate : new Date(rawDeathDate);

    if (isNaN(birthDate.getTime()) || isNaN(deathDate.getTime())) {
      console.error('Neplatné datum narození nebo úmrtí.', { birthDate, deathDate });
      weeks.value = [];
      return;
    }

    if (birthDate >= deathDate) {
      console.error('Datum úmrtí musí být po datu narození.');
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
      });

      currentWeekStart = addWeeks(currentWeekStart, 1);
      currentWeekEnd = endOfISOWeek(currentWeekStart);
    }

    console.log('Generated weeks:', computedWeeks.length);

    try {
      const backendWeeks = await WeeksApiService.getWeeksInLives();
      console.log('Fetched backend weeks:', backendWeeks.length);

      const backendMap = new Map<string, typeof backendWeeks[number]>();
      backendWeeks.forEach((bw) => {
        const key = `${bw.year}-${bw.week_number}`;
        backendMap.set(key, bw);
      });
      console.log('Backend map:', backendMap);

      computedWeeks.forEach((week) => {
        const key = `${week.year}-${week.weekNumber}`;
        const matchingBackend = backendMap.get(key);
        if (matchingBackend) {
          week.additionalInfo = matchingBackend.memo || undefined;
        }
      });
    } catch (error) {
      console.error('Chyba při načítání týdnů z BE:', error);
    }

    console.log('Final computedWeeks:', computedWeeks.length);
    weeks.value = computedWeeks;
  };

  return {
    weeks,
    loadWeeks,
  };
});
