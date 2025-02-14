import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

export const useDietStore = defineStore('lifeGainDiet', () => {
  const questionnaireStore = useQuestionnaireStore();

  const age = computed<number>(() => {
    if (!questionnaireStore.birthDate) return 20;
    const today = new Date();
    const birthDate = new Date(questionnaireStore.birthDate);
    let userAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      userAge--;
    }
    return userAge;
  });

  const sex = computed<'male' | 'female'>(() => {
    return questionnaireStore.gender === 'male' ? 'male' : 'female';
  });

  const dietType = computed<'typical' | 'feasible' | 'optimal'>(() => {
    if (questionnaireStore.eatingHabits === 'optimal') return 'optimal';
    if (questionnaireStore.eatingHabits === 'feasible') return 'feasible';
    return 'typical';
  });

  const OPTIMAL_FEMALE_20 = 10.7;
  const OPTIMAL_MALE_20   = 13.0;

  const OPTIMAL_FEMALE_80 = 3.4;
  const OPTIMAL_MALE_80   = 3.4;


  const FEASIBLE_FEMALE_20 = 6.2;
  const FEASIBLE_MALE_20   = 7.3;

  const FEASIBLE_FEMALE_80 = FEASIBLE_FEMALE_20 * (OPTIMAL_FEMALE_80 / OPTIMAL_FEMALE_20);
  const FEASIBLE_MALE_80   = FEASIBLE_MALE_20 * (OPTIMAL_MALE_80 / OPTIMAL_MALE_20);

  function linearInterpolation(
    currentAge: number,
    age20: number,
    value20: number,
    age80: number,
    value80: number
  ): number {
    if (currentAge <= age20) return value20;
    if (currentAge >= age80) return value80;
    const fraction = (currentAge - age20) / (age80 - age20);
    return value20 + fraction * (value80 - value20);
  }

  const lifeGainYears = computed<number>(() => {
    if (dietType.value === 'typical') {
      return 0;
    } else if (dietType.value === 'optimal') {
      if (sex.value === 'female') {
        return linearInterpolation(age.value, 20, OPTIMAL_FEMALE_20, 80, OPTIMAL_FEMALE_80);
      } else {
        return linearInterpolation(age.value, 20, OPTIMAL_MALE_20, 80, OPTIMAL_MALE_80);
      }
    } else if (dietType.value === 'feasible') {
      if (sex.value === 'female') {
        return linearInterpolation(age.value, 20, FEASIBLE_FEMALE_20, 80, FEASIBLE_FEMALE_80);
      } else {
        return linearInterpolation(age.value, 20, FEASIBLE_MALE_20, 80, FEASIBLE_MALE_80);
      }
    }
    return 0;
  });

  return {
    age,
    sex,
    dietType,
    lifeGainYears,
  };
});
