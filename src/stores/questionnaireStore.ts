import { defineStore } from 'pinia';

export interface QuestionnaireState {
  nationality: string | null;
  gender: string | null;
  smoking: boolean | null;
  alcohol: string | null;
  physicalActivity: string | null;
  eatingHabits: string | null;
  desiredAge: number | null;
}

export const useQuestionnaireStore = defineStore('questionnaire', {
  state: (): QuestionnaireState => ({
    nationality: null,
    gender: null,
    smoking: null,
    alcohol: null,
    physicalActivity: null,
    eatingHabits: null,
    desiredAge: null,
  }),
  actions: {
    updateField(field: keyof QuestionnaireState, value: any) {
      (this as any)[field] = value;
    },
  },
});
