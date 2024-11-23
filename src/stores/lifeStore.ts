import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { LifeWeek } from '@/interfaces/LifeWeek';
import {
  startOfISOWeek,
  endOfISOWeek,
  addWeeks,
  isWithinInterval,
  getISOWeek,
  getISOWeekYear,
} from 'date-fns';

export const useLifeStore = defineStore('lifeStore', () => {
  const dateOfBirth = ref<Date | null>(null);
  const expectedDeathDate = ref<Date | null>(null);

  const weeks = ref<LifeWeek[]>([]);

  // Metody pro nastavení dat narození a očekávaného úmrtí
  const setDateOfBirth = (date: Date) => {
    dateOfBirth.value = date;
    computeWeeks();
  };

  const setExpectedDeathDate = (date: Date) => {
    expectedDeathDate.value = date;
    computeWeeks();
  };

  // Metoda pro výpočet všech týdnů mezi datem narození a očekávaným úmrtím
  const computeWeeks = () => {
    if (!dateOfBirth.value || !expectedDeathDate.value) {
      weeks.value = [];
      return;
    }

    if (dateOfBirth.value >= expectedDeathDate.value) {
      console.error('Datum úmrtí musí být po datu narození.');
      weeks.value = [];
      return;
    }

    const computedWeeks: LifeWeek[] = [];
    const today = new Date();

    // Začneme od začátku týdne, kde se nachází datum narození
    let currentWeekStart = startOfISOWeek(dateOfBirth.value);
    let currentWeekEnd = endOfISOWeek(currentWeekStart);

    // Dokud nezačneme týdnem po očekávaném datu úmrtí
    while (currentWeekStart <= expectedDeathDate.value) {
      // Pokud je konec týdne po očekávaném datu úmrtí, nastavíme konec na očekávané datum
      const adjustedWeekEnd =
        currentWeekEnd > expectedDeathDate.value
          ? expectedDeathDate.value
          : currentWeekEnd;

      const weekNumber = getISOWeek(currentWeekStart);
      const year = getISOWeekYear(currentWeekStart);

      const isCurrent = isWithinInterval(today, {
        start: currentWeekStart,
        end: currentWeekEnd,
      });

      const lifeWeek: LifeWeek = {
        year,
        weekNumber,
        startDate: new Date(currentWeekStart),
        endDate: new Date(adjustedWeekEnd),
        isCurrentWeek: isCurrent,
        // Přidejte další informace zde podle potřeby
      };

      computedWeeks.push(lifeWeek);

      // Posun na další týden
      currentWeekStart = addWeeks(currentWeekStart, 1);
      currentWeekEnd = endOfISOWeek(currentWeekStart);
    }

    // Seřazení týdnů od nejstaršího po nejnovější
    computedWeeks.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.weekNumber - b.weekNumber;
    });

    weeks.value = computedWeeks;
  };

  return {
    dateOfBirth,
    expectedDeathDate,
    weeks,
    setDateOfBirth,
    setExpectedDeathDate,
    computeWeeks, // Exportujeme metodu pro případné další použití
  };
});
