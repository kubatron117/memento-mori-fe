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
  const smoking = ref<string | null>(null);
  const cigarettesPerDay = ref<number | null>(null);
  const startAge = ref<number | null>(null);
  const planToQuit = ref<boolean>(false);
  const quitTimeFrame = ref<number | null>(null);
  const stopAge = ref<number | null>(null);
  const daysLost = ref<number>(0);
  const additionalDaysLost = ref<number>(0);

  const questionnaireStore = useQuestionnaireStore();

  function calculateLifeLoss() {
    if (smoking.value !== 'yes' && smoking.value !== 'past') {
      daysLost.value = 0;
      additionalDaysLost.value = 0;
      return;
    }

    let lostMinutesPerCigarette: number;
    const gender: string | null = questionnaireStore.gender === 'other' ? null : questionnaireStore.gender;
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
    let currentAge = today.getFullYear() - questionnaireStore.birthDate?.getFullYear()!;
    const m = today.getMonth() - questionnaireStore.birthDate?.getMonth()!;
    if (m < 0 || (m === 0 && today.getDate() < questionnaireStore.birthDate?.getDate()!)) {
      currentAge--;
    }

    let yearsSmoking = 0;
    if (smoking.value === 'yes') {
      if (startAge.value === null || cigarettesPerDay.value === null || questionnaireStore.birthDate === null) {
        daysLost.value = 0;
        additionalDaysLost.value = 0;
        return;
      }
      yearsSmoking = currentAge - (startAge.value as number);
      if (yearsSmoking < 0) {
        daysLost.value = 0;
        additionalDaysLost.value = 0;
        return;
      }
      const daysSmoking = yearsSmoking * DAYS_IN_YEAR;
      const dailyLossInDays = (cigarettesPerDay.value * lostMinutesPerCigarette) / MINUTES_IN_DAY;
      daysLost.value = dailyLossInDays * daysSmoking;

      let additionalYears = 0;
      if (planToQuit.value && quitTimeFrame.value != null) {
        additionalYears = quitTimeFrame.value;
      } else if (!planToQuit.value && currentAge < DEFAULT_QUIT_AGE) {
        additionalYears = DEFAULT_QUIT_AGE - currentAge;
      }
      const additionalDaysSmoking = additionalYears * DAYS_IN_YEAR;
      additionalDaysLost.value = dailyLossInDays * additionalDaysSmoking;
    } else if (smoking.value === 'past') {
      if (startAge.value === null || cigarettesPerDay.value === null || stopAge.value === null) {
        daysLost.value = 0;
        additionalDaysLost.value = 0;
        return;
      }
      yearsSmoking = (stopAge.value as number) - (startAge.value as number);
      if (yearsSmoking < 0) {
        daysLost.value = 0;
        additionalDaysLost.value = 0;
        return;
      }
      const daysSmoking = yearsSmoking * DAYS_IN_YEAR;
      const dailyLossInDays = (cigarettesPerDay.value * lostMinutesPerCigarette) / MINUTES_IN_DAY;
      daysLost.value = dailyLossInDays * daysSmoking;
      additionalDaysLost.value = 0;
    }
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
      planToQuit,
      quitTimeFrame,
      stopAge,
      () => questionnaireStore.gender,
      () => questionnaireStore.birthDate,
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

  function reset() {
    smoking.value = null;
    cigarettesPerDay.value = null;
    startAge.value = null;
    planToQuit.value = false;
    quitTimeFrame.value = null;
    stopAge.value = null;
  }

  return {
    smoking,
    cigarettesPerDay,
    startAge,
    planToQuit,
    quitTimeFrame,
    stopAge,
    daysLost,
    additionalDaysLost,
    calculateLifeLoss,
    updateMainStore,
    reset,
  };
});
