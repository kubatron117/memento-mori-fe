import { defineStore } from 'pinia';

export interface LifeExpectancyData {
  both: number | null;
  male: number | null;
  female: number | null;
}

export interface QuestionnaireState {
  birthDate: Date | null;
  nationality: string | null;
  gender: string | null;
  smoking: boolean | null;
  alcohol: string | null;
  physicalActivity: string | null;
  eatingHabits: string | null;
  desiredAgeCalculated: number | null;
  desiredAge: number | null;
  lifeExpectancy: LifeExpectancyData;
  // Výsledky výpočtů:
  smokingDaysLost: number;
  smokingAdditionalDaysLost: number;
  activityLifeGain: number;
  dietLifeGain: number;
  alcoholLifeLoss: number;
}

export const useQuestionnaireStore = defineStore('questionnaire', {
  state: (): QuestionnaireState => ({
    birthDate: null,
    nationality: null,
    gender: null,
    smoking: null,
    alcohol: null,
    physicalActivity: null,
    eatingHabits: null,
    desiredAgeCalculated: 80,
    desiredAge: null,
    lifeExpectancy: {
      both: null,
      male: null,
      female: null,
    },
    smokingDaysLost: 0,
    smokingAdditionalDaysLost: 0,
    activityLifeGain: 0,
    dietLifeGain: 0,
    alcoholLifeLoss: 0,
  }),

  getters: {
    finalLifeExpectancy(state): number {
      let base = 0;
      if (state.desiredAgeCalculated !== null) {
        base = state.desiredAgeCalculated;
      } else if (state.lifeExpectancy) {
        if (state.gender === 'male' && state.lifeExpectancy.male !== null) {
          base = state.lifeExpectancy.male;
        } else if (state.gender === 'female' && state.lifeExpectancy.female !== null) {
          base = state.lifeExpectancy.female;
        } else {
          base = state.lifeExpectancy.both || 0;
        }
      }
      const smokingLossYears = state.smokingDaysLost / 365;
      const additionalSmokingLossYears = state.smokingAdditionalDaysLost / 365;
      return (
        base +
        state.activityLifeGain +
        state.dietLifeGain -
        state.alcoholLifeLoss -
        smokingLossYears -
        additionalSmokingLossYears
      );
    },
  },

  actions: {
    updateField<K extends keyof QuestionnaireState>(
      field: K,
      value: QuestionnaireState[K]
    ) {
      if ((field === 'desiredAgeCalculated' || field === 'desiredAge') && typeof value === 'number') {
        if (value > 140) {
          console.log('Maximum je 140 let');
          value = 140 as QuestionnaireState[K];
        }
      }
      this.$patch({ [field]: value });
    },
    calculateAdjustedLifeExpectancy(): number {
      let base = 0;
      if (this.desiredAgeCalculated !== null) {
        base = this.desiredAgeCalculated;
      } else if (this.lifeExpectancy) {
        if (this.gender === 'male' && this.lifeExpectancy.male !== null) {
          base = this.lifeExpectancy.male;
        } else if (this.gender === 'female' && this.lifeExpectancy.female !== null) {
          base = this.lifeExpectancy.female;
        } else {
          base = this.lifeExpectancy.both || 0;
        }
      }
      const smokingLossYears = this.smokingDaysLost / 365;
      const additionalSmokingLossYears = this.smokingAdditionalDaysLost / 365;
      return (
        base +
        this.activityLifeGain +
        this.dietLifeGain -
        this.alcoholLifeLoss -
        smokingLossYears -
        additionalSmokingLossYears
      );
    },
    getCurrentAge(): number {
      if (!this.birthDate) {
        return 0;
      }
      const today = new Date();
      let age = today.getFullYear() - this.birthDate.getFullYear();
      const monthDiff = today.getMonth() - this.birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < this.birthDate.getDate())
      ) {
        age--;
      }
      return age;
    },
  },
});
