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
      if (state.desiredAge !== null) {
        base = state.desiredAge;
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
      return base + state.activityLifeGain + state.dietLifeGain - state.alcoholLifeLoss - smokingLossYears - additionalSmokingLossYears;
    },
  },
  actions: {
    updateField(field: keyof QuestionnaireState, value: any) {
      this[field] = value;
    },
    updateResults(results: Partial<Pick<QuestionnaireState,
      'activityLifeGain' |
      'dietLifeGain' |
      'alcoholLifeLoss' |
      'smokingDaysLost' |
      'smokingAdditionalDaysLost'
    >>) {
      Object.assign(this, results);
    },
  },
});
