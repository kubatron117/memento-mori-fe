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
  dietStartAge: number | null;
  desiredAgeCalculated: number | null;
  desiredAge: number | null;
  lifeExpectancy: LifeExpectancyData;
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
    dietStartAge: null,
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
    normalizedGender(): string | null {
      return (this.gender === 'male' || this.gender === 'female')
        ? this.gender
        : null;
    },
    baseLifeExpectancyForGender(): number {
      let base = 0;
      if (
        (this.birthDate && this.birthDate.getFullYear() < 1950) ||
        (!this.lifeExpectancy ||
          (this.lifeExpectancy.both === null &&
            this.lifeExpectancy.male === null &&
            this.lifeExpectancy.female === null))
      ) {
        base = 80;
      } else {
        if (this.normalizedGender === 'male' && this.lifeExpectancy.male !== null) {
          base = this.lifeExpectancy.male;
        } else if (this.normalizedGender === 'female' && this.lifeExpectancy.female !== null) {
          base = this.lifeExpectancy.female;
        } else {
          base = this.lifeExpectancy.both || 0;
        }
      }
      return base;
    },
    finalLifeExpectancy(): number {
      let base = this.baseLifeExpectancyForGender;
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
  },

  actions: {
    updateField<K extends keyof QuestionnaireState>(
      field: K,
      value: QuestionnaireState[K]
    ) {
      if ((field === 'desiredAgeCalculated' || field === 'desiredAge') && typeof value === 'number') {
        if (value > 139) {
          value = 139 as QuestionnaireState[K];
        }
      }
      this.$patch({ [field]: value });
    },
    updateGender(newGender: string) {
      this.gender = newGender;
    },
    getCurrentAge(): number {
      if (!this.birthDate) {
        return 0;
      }
      const today = new Date();
      let age = today.getFullYear() - this.birthDate.getFullYear();
      const monthDiff = today.getMonth() - this.birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
        age--;
      }
      return age;
    },
  },
});
