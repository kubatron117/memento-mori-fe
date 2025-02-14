import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

export const useActivityStore = defineStore('lifeGainActivity', () => {
  const exerciseType = ref<'moderate' | 'vigorous'>('moderate');
  const exerciseMinutes = ref<number>(0);

  const RECOMMENDED_MODERATE_MINUTES = 150;
  const RECOMMENDED_VIGOROUS_MINUTES = 75;
  const MAX_LIFE_GAIN_YEARS = 5;

  const lifeGainYears = computed<number>(() => {
    if (exerciseType.value === 'moderate') {
      return Math.min(
        (exerciseMinutes.value / RECOMMENDED_MODERATE_MINUTES) * MAX_LIFE_GAIN_YEARS,
        MAX_LIFE_GAIN_YEARS
      );
    } else {
      return Math.min(
        (exerciseMinutes.value / RECOMMENDED_VIGOROUS_MINUTES) * MAX_LIFE_GAIN_YEARS,
        MAX_LIFE_GAIN_YEARS
      );
    }
  });

  function updateMainStore() {
    const questionnaireStore = useQuestionnaireStore();
    questionnaireStore.updateField('activityLifeGain', lifeGainYears.value);
  }

  watch(lifeGainYears, () => {
    updateMainStore();
  });

  return {
    exerciseType,
    exerciseMinutes,
    lifeGainYears,
    updateMainStore,
  };
});
