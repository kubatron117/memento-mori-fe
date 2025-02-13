import { defineStore } from 'pinia';

export interface LifeLossSmokingState {
  smoking: boolean | null;
  cigarettesPerDay: number | null;
  startAge: number | null;
  plannedQuitAge: number | null;
  daysLost: number;
  additionalDaysLost: number;
}

const LOST_MINUTES_MALE = 17;
const LOST_MINUTES_FEMALE = 22;
const LOST_MINUTES_AVERAGE = (LOST_MINUTES_MALE + LOST_MINUTES_FEMALE) / 2;
const MINUTES_IN_DAY = 1440;
const DAYS_IN_YEAR = 365;
const DEFAULT_QUIT_AGE = 80;

export const useLifeLossSmokingStore = defineStore('lifeLossSmoking', {
  state: (): LifeLossSmokingState => ({
    smoking: null,
    cigarettesPerDay: null,
    startAge: null,
    plannedQuitAge: null,
    daysLost: 0,
    additionalDaysLost: 0,
  }),
  actions: {
    calculateLifeLoss(gender: string | null, birthDate: Date | null) {
      if (
        !this.smoking ||
        this.cigarettesPerDay == null ||
        this.startAge == null ||
        birthDate == null
      ) {
        this.daysLost = 0;
        this.additionalDaysLost = 0;
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

      const yearsSmoking = currentAge - this.startAge;
      if (yearsSmoking < 0) {
        this.daysLost = 0;
        this.additionalDaysLost = 0;
        return;
      }

      const daysSmoking = yearsSmoking * DAYS_IN_YEAR;
      const dailyLossInDays =
        (this.cigarettesPerDay * lostMinutesPerCigarette) / MINUTES_IN_DAY;

      this.daysLost = dailyLossInDays * daysSmoking;

      let additionalYears = 0;
      if (this.plannedQuitAge != null && this.plannedQuitAge > currentAge) {
        additionalYears = this.plannedQuitAge - currentAge;
      } else if (currentAge < DEFAULT_QUIT_AGE) {
        additionalYears = DEFAULT_QUIT_AGE - currentAge;
      }

      const additionalDaysSmoking = additionalYears * DAYS_IN_YEAR;
      this.additionalDaysLost = dailyLossInDays * additionalDaysSmoking;
    },
  },
});
