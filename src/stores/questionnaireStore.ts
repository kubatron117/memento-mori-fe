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
  smokingDaysLost: number;
  smokingAdditionalDaysLost: number;
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
    smokingAdditionalDaysLost: 0
  }),
  actions: {
    updateField(field: keyof QuestionnaireState, value: any) {
      this[field] = value;
    },
  },
});
