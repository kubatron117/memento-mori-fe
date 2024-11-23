import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLifeStore = defineStore('lifeStore', () => {
  const dateOfBirth = ref<Date | null>(null);
  const expectedDeathDate = ref<Date | null>(null);

  const setDateOfBirth = (date: Date) => {
    dateOfBirth.value = date;
  };

  const setExpectedDeathDate = (date: Date) => {
    expectedDeathDate.value = date;
  };

  return {
    dateOfBirth,
    expectedDeathDate,
    setDateOfBirth,
    setExpectedDeathDate,
  };
});
