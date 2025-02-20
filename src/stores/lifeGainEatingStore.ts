import { defineStore } from 'pinia';
import { computed, watch } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

/**
 * Helper function for piecewise linear interpolation.
 * It takes the "userAge" and an array of points (each with an age and a value).
 * - If userAge is below the smallest age, returns the value of the first point.
 * - If userAge is above the largest age, returns the value of the last point.
 * - Otherwise, it finds the two neighboring points and performs linear interpolation between them.
 */
function piecewiseInterpolate(
  userAge: number,
  points: Array<{ age: number; value: number }>
): number {
  // 1) If userAge is less than the first point's age, return the first value
  if (userAge <= points[0].age) {
    return points[0].value;
  }
  // 2) If userAge is greater than the last point's age, return the last value
  if (userAge >= points[points.length - 1].age) {
    return points[points.length - 1].value;
  }
  // 3) Otherwise, find the interval in which userAge falls
  for (let i = 0; i < points.length - 1; i++) {
    const ageA = points[i].age;
    const valA = points[i].value;
    const ageB = points[i + 1].age;
    const valB = points[i + 1].value;
    if (userAge >= ageA && userAge <= ageB) {
      const fraction = (userAge - ageA) / (ageB - ageA);
      return valA + fraction * (valB - valA);
    }
  }
  return points[points.length - 1].value;
}

// Constants for life gain estimates (typical -> optimal / typical -> feasible)
// based on study data (for the US population)
const GAINS_FEMALE_OPTIMAL = [
  { age: 20, value: 10.7 },
  { age: 60, value: 8.0 },
  { age: 80, value: 3.4 },
];
const GAINS_MALE_OPTIMAL = [
  { age: 20, value: 13.0 },
  { age: 60, value: 8.8 },
  { age: 80, value: 3.4 },
];

// For the feasible diet, values are provided directly for age 20,
// while for ages 60 and 80 the values are calculated as a ratio to the "optimal" diet.
//
// According to the study: a 20-year-old woman gains +6.2 years, and a man gains +7.3 years.
// The study does not explicitly provide values for ages 60 and 80, so the ratio to optimal is used.
const GAINS_FEMALE_FEASIBLE = [
  { age: 20, value: 6.2 }, // (from the study)
  { age: 60, value: 6.2 * (8.0 / 10.7) },  // ~4.63
  { age: 80, value: 6.2 * (3.4 / 10.7) },  // ~1.97
];
const GAINS_MALE_FEASIBLE = [
  { age: 20, value: 7.3 },
  { age: 60, value: 7.3 * (8.8 / 13.0) },  // ~4.94
  { age: 80, value: 7.3 * (3.4 / 13.0) },  // ~1.91
];

export const useDietStore = defineStore('lifeGainDiet', () => {
  const questionnaireStore = useQuestionnaireStore();

  const age = computed<number>(() => {
    const currentAge = questionnaireStore.getCurrentAge();
    return currentAge || 20;
  });

  const sex = computed<'male' | 'female'>(() => {
    return questionnaireStore.gender === 'male' ? 'male' : 'female';
  });

  const dietType = computed<'typical' | 'feasible' | 'optimal'>(() => {
    if (questionnaireStore.eatingHabits === 'optimal') return 'optimal';
    if (questionnaireStore.eatingHabits === 'feasible') return 'feasible';
    return 'typical';
  });

  const lifeGainYears = computed<number>(() => {
    if (dietType.value === 'typical') {
      return 0;
    }
    if (sex.value === 'female') {
      if (dietType.value === 'optimal') {
        return piecewiseInterpolate(age.value, GAINS_FEMALE_OPTIMAL);
      } else {
        return piecewiseInterpolate(age.value, GAINS_FEMALE_FEASIBLE);
      }
    } else {
      if (dietType.value === 'optimal') {
        return piecewiseInterpolate(age.value, GAINS_MALE_OPTIMAL);
      } else {
        return piecewiseInterpolate(age.value, GAINS_MALE_FEASIBLE);
      }
    }
  });

  function updateMainStore() {
    questionnaireStore.updateField('dietLifeGain', lifeGainYears.value);
    console.log('dietLifeGain', questionnaireStore.dietLifeGain);
  }

  watch(lifeGainYears, () => {
    updateMainStore();
  }, { immediate: true });

  function reset() {
    questionnaireStore.updateField('eatingHabits', null);
  }

  return {
    age,
    sex,
    dietType,
    lifeGainYears,
    updateMainStore,
    reset,
  };
});
