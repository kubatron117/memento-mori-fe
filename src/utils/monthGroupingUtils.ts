export interface Week {
  year: number;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  isCurrentWeek: boolean;
  total_score: number | null | undefined;
  additionalInfo?: string;
}

export interface InnerGroup {
  key: string;
  label: string;
  weeks: Week[];
  aggregatedScore?: number | null;
  hasFuture?: boolean;
}

export interface DecadeGroup {
  key: string;
  label: string;
  groups: InnerGroup[];
}

function groupBy<T, K>(items: T[], keyGetter: (item: T) => K): Map<K, T[]> {
  return items.reduce((map, item) => {
    const key = keyGetter(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
    return map;
  }, new Map<K, T[]>());
}

function isWeekPassed(week: Week): boolean {
  return week.endDate.getTime() < Date.now();
}

function calculateAggregatedScore(weeks: Week[]): number | null {
  const validWeeks = weeks.filter(
    week =>
      week.total_score !== null &&
      week.total_score !== undefined &&
      (isWeekPassed(week) || week.isCurrentWeek)
  );
  if (validWeeks.length === 0) return null;
  return validWeeks.reduce((sum, week) => sum + (week.total_score as number), 0) / validWeeks.length;
}

function hasFutureWeek(weeks: Week[]): boolean {
  return weeks.some(week => !isWeekPassed(week) && !week.isCurrentWeek);
}

function createInnerGroup(key: string, label: string, weeks: Week[], withAggregation: boolean = false): InnerGroup {
  const group: InnerGroup = { key, label, weeks };
  if (withAggregation) {
    group.aggregatedScore = calculateAggregatedScore(weeks);
    group.hasFuture = hasFutureWeek(weeks);
  }
  return group;
}

function groupWeeksByYear(weeks: Week[]): DecadeGroup[] {
  const yearMap = groupBy(weeks, week => week.year);
  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);
  const innerGroups = sortedYears.map(year => {
    const weeksForYear = yearMap.get(year)!;
    return createInnerGroup(`year-${year}`, `${year}`, weeksForYear, true);
  });
  const outerLabel = sortedYears.length > 0 ? `${sortedYears[0]} – ${sortedYears[sortedYears.length - 1]}` : '';
  return [{ key: 'year-all', label: outerLabel, groups: innerGroups }];
}

function groupWeeksByDecadeWeek(weeks: Week[]): DecadeGroup[] {
  const decadeMap = groupBy(weeks, week => Math.floor(week.year / 10) * 10);
  const sortedDecades = Array.from(decadeMap.keys()).sort((a, b) => a - b);
  return sortedDecades.map(decade => {
    const weeksInDecade = decadeMap.get(decade)!;
    const sortedWeeks = weeksInDecade.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    const innerGroups = sortedWeeks.map(week =>
      createInnerGroup(`week-${week.year}-${week.weekNumber}`, `Týden ${week.weekNumber}`, [week])
    );
    return { key: `decade-${decade}`, label: `${decade} – ${decade + 9}`, groups: innerGroups };
  });
}

function groupWeeksByDecadeMonth(weeks: Week[]): DecadeGroup[] {
  const decadeMap = groupBy(weeks, week => Math.floor(week.year / 10) * 10);
  const sortedDecades = Array.from(decadeMap.keys()).sort((a, b) => a - b);
  return sortedDecades.map(decade => {
    const weeksInDecade = decadeMap.get(decade)!;
    const monthMap = groupBy(weeksInDecade, week => `${week.startDate.getFullYear()}-${week.startDate.getMonth() + 1}`);
    const sortedMonthKeys = Array.from(monthMap.keys()).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return yearA === yearB ? monthA - monthB : yearA - yearB;
    });
    const innerGroups = sortedMonthKeys.map(key => {
      const [year, month] = key.split('-').map(Number);
      const monthName = new Date(year, month - 1).toLocaleString('cs-CZ', { month: 'long' });
      const weeksForMonth = monthMap.get(key)!;
      return createInnerGroup(`month-${key}`, `${monthName} ${year}`, weeksForMonth, true);
    });
    return { key: `decade-${decade}`, label: `${decade} – ${decade + 9}`, groups: innerGroups };
  });
}

export const groupWeeks = (weeks: Week[], visualization: 'week' | 'month' | 'year'): DecadeGroup[] => {
  if (visualization === 'year') {
    return groupWeeksByYear(weeks);
  } else if (visualization === 'week') {
    return groupWeeksByDecadeWeek(weeks);
  } else {
    return groupWeeksByDecadeMonth(weeks);
  }
};
