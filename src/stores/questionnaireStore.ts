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
    normalizedGender(): string | null {
      return (this.gender === 'male' || this.gender === 'female')
        ? this.gender
        : null;
    },
    finalLifeExpectancy(): number {
      let base = 0;
      if (this.desiredAgeCalculated !== null) {
        base = this.desiredAgeCalculated;
      } else if (this.lifeExpectancy) {
        if (this.normalizedGender === 'male' && this.lifeExpectancy.male !== null) {
          base = this.lifeExpectancy.male;
        } else if (this.normalizedGender === 'female' && this.lifeExpectancy.female !== null) {
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
  },

  actions: {
    updateField<K extends keyof QuestionnaireState>(
      field: K,
      value: QuestionnaireState[K]
    ) {
      if ((field === 'desiredAgeCalculated' || field === 'desiredAge') && typeof value === 'number') {
        if (value > 139) {
          console.log('Maximum je 139 let');
          value = 139 as QuestionnaireState[K];
        }
      }
      this.$patch({ [field]: value });
    },
    updateGender(newGender: string) {
      this.gender = newGender;
    },
    // calculateAdjustedLifeExpectancy(): number {
    //   let base = 0;
    //   if (this.desiredAgeCalculated !== null) {
    //     base = this.desiredAgeCalculated;
    //   } else if (this.lifeExpectancy) {
    //     if (this.normalizedGender === 'male' && this.lifeExpectancy.male !== null) {
    //       base = this.lifeExpectancy.male;
    //     } else if (this.normalizedGender === 'female' && this.lifeExpectancy.female !== null) {
    //       base = this.lifeExpectancy.female;
    //     } else {
    //       base = this.lifeExpectancy.both || 0;
    //     }
    //   }
    //   const smokingLossYears = this.smokingDaysLost / 365;
    //   const additionalSmokingLossYears = this.smokingAdditionalDaysLost / 365;
    //   return (
    //     base +
    //     this.activityLifeGain +
    //     this.dietLifeGain -
    //     this.alcoholLifeLoss -
    //     smokingLossYears -
    //     additionalSmokingLossYears
    //   );
    // },
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
