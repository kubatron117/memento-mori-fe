import type { Week, InnerGroup } from './monthGroupingUtils';

const isWeekPassed = (week: Week): boolean => {
  return week.endDate.getTime() < Date.now();
};

export const getWeekBgClass = (week: Week, scoreVisualizationEnabled: boolean): string => {
  if (!scoreVisualizationEnabled) {
    return week.isCurrentWeek ? 'bg-orange-500' : (isWeekPassed(week) ? 'bg-black' : 'bg-gray-300');
  } else {
    if (!week.isCurrentWeek && !isWeekPassed(week)) {
      return 'bg-gray-300';
    }
    if (week.total_score === null || week.total_score === undefined) {
      return 'bg-black';
    }
    if (week.total_score < 12) {
      return 'bg-red-500';
    } else if (week.total_score < 19) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  }
};

export const getGroupBgClass = (group: InnerGroup, scoreVisualizationEnabled: boolean): string => {
  if (!scoreVisualizationEnabled) {
    if (group.weeks.some(week => week.isCurrentWeek)) {
      return 'bg-orange-500';
    } else if (group.weeks.every(week => isWeekPassed(week))) {
      return 'bg-black';
    } else {
      return 'bg-gray-300';
    }
  } else {
    if (group.hasFuture) return 'bg-gray-300';
    if (group.aggregatedScore === null || group.aggregatedScore === undefined) return 'bg-black';
    if (group.aggregatedScore < 12) return 'bg-red-500';
    else if (group.aggregatedScore < 19) return 'bg-yellow-500';
    else return 'bg-green-500';
  }
};
