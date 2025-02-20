import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

const LOST_MINUTES_MALE = 17;
const LOST_MINUTES_FEMALE = 22;
const LOST_MINUTES_AVERAGE = (LOST_MINUTES_MALE + LOST_MINUTES_FEMALE) / 2;
const MINUTES_IN_DAY = 1440;
const DAYS_IN_YEAR = 365;
const DEFAULT_QUIT_AGE = 80;

export const useLifeLossSmokingStore = defineStore('lifeLossSmoking', () => {
  const smoking = ref<boolean | null>(null);
  const cigarettesPerDay = ref<number | null>(null);
  const startAge = ref<number | null>(null);
  const plannedQuitAge = ref<number | null>(null);
  const planToQuit = ref<boolean>(false);
  const daysLost = ref<number>(0);
  const additionalDaysLost = ref<number>(0);

  const questionnaireStore = useQuestionnaireStore();

  function calculateLifeLoss() {
    const gender: string | null = questionnaireStore.gender;
    const birthDate: Date | null = questionnaireStore.birthDate;

    if (
      !smoking.value ||
      cigarettesPerDay.value === null ||
      startAge.value === null ||
      birthDate === null
    ) {
      daysLost.value = 0;
      additionalDaysLost.value = 0;
      return;
    }

    let lostMinutesPerCigarette: number;
    if (gender === null) {
      lostMinutesPerCigarette = LOST_MINUTES_AVERAGE;
    } else {
      const genderLower = gender.toLowerCase();
      if (genderLower === 'male') {
        lostMinutesPerCigarette = LOST_MINUTES_MALE;
      } else if (genderLower === 'female') {
        lostMinutesPerCigarette = LOST_MINUTES_FEMALE;
      } else {
        lostMinutesPerCigarette = LOST_MINUTES_AVERAGE;
      }
    }

    const today = new Date();
    let currentAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      currentAge--;
    }

    const yearsSmoking = currentAge - (startAge.value as number);
    if (yearsSmoking < 0) {
      daysLost.value = 0;
      additionalDaysLost.value = 0;
      return;
    }

    const daysSmoking = yearsSmoking * DAYS_IN_YEAR;
    const dailyLossInDays =
      (cigarettesPerDay.value! * lostMinutesPerCigarette) / MINUTES_IN_DAY;

    daysLost.value = dailyLossInDays * daysSmoking;

    let additionalYears = 0;
    if (planToQuit.value && plannedQuitAge.value != null) {
      const effectiveQuitAge =
        startAge.value !== null && plannedQuitAge.value < startAge.value
          ? startAge.value
          : plannedQuitAge.value;
      if (effectiveQuitAge > currentAge) {
        additionalYears = effectiveQuitAge - currentAge;
      }
    } else if (currentAge < DEFAULT_QUIT_AGE) {
      additionalYears = DEFAULT_QUIT_AGE - currentAge;
    }

    const additionalDaysSmoking = additionalYears * DAYS_IN_YEAR;
    additionalDaysLost.value = dailyLossInDays * additionalDaysSmoking;
  }

  function updateMainStore() {
    questionnaireStore.updateField('smokingDaysLost', daysLost.value);
    questionnaireStore.updateField('smokingAdditionalDaysLost', additionalDaysLost.value);
    console.log('smokingDaysLost', questionnaireStore.smokingDaysLost);
    console.log('smokingAdditionalDaysLost', questionnaireStore.smokingAdditionalDaysLost);
  }

  watch(
    [
      smoking,
      cigarettesPerDay,
      startAge,
      plannedQuitAge,
      () => questionnaireStore.gender,
      () => questionnaireStore.birthDate,
      planToQuit,
    ],
    () => {
      calculateLifeLoss();
    },
    { immediate: true }
  );

  watch(
    [daysLost, additionalDaysLost],
    () => {
      updateMainStore();
    },
    { immediate: true }
  );

  return {
    smoking,
    cigarettesPerDay,
    startAge,
    plannedQuitAge,
    planToQuit,
    daysLost,
    additionalDaysLost,
    calculateLifeLoss,
    updateMainStore,
  };
});
