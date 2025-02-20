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

  function getLostMinutesPerCigarette(): number {
    const gender = questionnaireStore.gender === 'other' ? null : questionnaireStore.gender;
    if (!gender) return LOST_MINUTES_AVERAGE;
    const lower = gender.toLowerCase();
    return lower === 'male' ? LOST_MINUTES_MALE : lower === 'female' ? LOST_MINUTES_FEMALE : LOST_MINUTES_AVERAGE;
  }

  function getCurrentAge(): number {
    const today = new Date();
    const birthDate = questionnaireStore.birthDate;
    if (!birthDate) return 0;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  function calculateDailyLoss(lostMinutes: number): number {
    return cigarettesPerDay.value ? (cigarettesPerDay.value * lostMinutes) / MINUTES_IN_DAY : 0;
  }

  function validateData(isPast: boolean): boolean {
    if (!startAge.value || !cigarettesPerDay.value) return false;
    return isPast ? !!stopAge.value : !!questionnaireStore.birthDate;
  }

  function computeYearsSmoking(isPast: boolean, currentAge: number): number {
    return isPast ? (stopAge.value as number) - startAge.value! : currentAge - startAge.value!;
  }

  function computeAdditionalYears(currentAge: number): number {
    return planToQuit.value && quitTimeFrame.value != null
      ? quitTimeFrame.value
      : currentAge < DEFAULT_QUIT_AGE
        ? DEFAULT_QUIT_AGE - currentAge : 0;
  }

  function calculateSmokingLoss(currentAge: number, lostMinutes: number): void {
    const isPast = smoking.value === 'past';
    if (!validateData(isPast)) {
      daysLost.value = 0;
      additionalDaysLost.value = 0;
      return;
    }
    const yearsSmoking = computeYearsSmoking(isPast, currentAge);
    if (yearsSmoking < 0) {
      daysLost.value = 0;
      additionalDaysLost.value = 0;
      return;
    }
    const dailyLoss = calculateDailyLoss(lostMinutes);
    daysLost.value = dailyLoss * yearsSmoking * DAYS_IN_YEAR;
    additionalDaysLost.value = smoking.value === 'yes' ? dailyLoss * computeAdditionalYears(currentAge) * DAYS_IN_YEAR : 0;
  }

  function calculateLifeLoss(): void {
    if (smoking.value !== 'yes' && smoking.value !== 'past') {
      daysLost.value = 0;
      additionalDaysLost.value = 0;
      return;
    }
    const lostMinutes = getLostMinutesPerCigarette();
    const currentAge = getCurrentAge();
    if (
      (smoking.value === 'yes' && (!startAge.value || !cigarettesPerDay.value || !questionnaireStore.birthDate)) ||
      (smoking.value === 'past' && (!startAge.value || !cigarettesPerDay.value || !stopAge.value))
    ) {
      daysLost.value = 0;
      additionalDaysLost.value = 0;
      return;
    }
    calculateSmokingLoss(currentAge, lostMinutes);
  }

  function updateMainStore(): void {
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
    calculateLifeLoss,
    { immediate: true }
  );

  watch([daysLost, additionalDaysLost], updateMainStore, { immediate: true });

  function reset(): void {
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
