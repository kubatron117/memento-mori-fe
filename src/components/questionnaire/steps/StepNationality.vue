<template>
  <div>
    <h2>Vyberte národnost</h2>
    <Select
      v-model="selectedNationality"
      :options="nationalities"
      optionLabel="location"
      optionValue="id"
      placeholder="Vyberte národnost"
      class="w-full md:w-56"
      filter
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { LocationsApiService, type Location } from '@/api/locationsApiServise';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import Select from 'primevue/select';
import { LifeExpectanciesApiService } from '@/api/lifeExpectanciesApiService';

const store = useQuestionnaireStore();
const nationalities = ref<Location[]>([]);

const selectedNationality = computed<number | null>({
  get: () => (store.nationality ? Number(store.nationality) : null),
  set: (val: number | null) => {
    store.nationality = val !== null ? val.toString() : null;
  },
});

onMounted(async () => {
  try {
    nationalities.value = await LocationsApiService.getLocations();
  } catch (error) {
    console.error('Error fetching nationalities:', error);
  }
});

watch(selectedNationality, async (newVal) => {
  if (newVal && store.birthDate) {
    const birthYear = store.birthDate.getFullYear();
    try {
      const lifeExpectancies = await LifeExpectanciesApiService.getLifeExpectancies({
        birth_year_eq: birthYear,
        location_id_eq: newVal,
      });
      if (lifeExpectancies && lifeExpectancies.length > 0) {
        const data = lifeExpectancies[0];
        store.lifeExpectancy = {
          both: data.life_expectancy_both,
          male: data.life_expectancy_male,
          female: data.life_expectancy_female,
        };
        console.log('Life Expectancies:', store.lifeExpectancy);
      } else {
        console.warn('No life expectancy data found');
      }
    } catch (error) {
      console.error('Error fetching life expectancies:', error);
    }
  } else if (!store.birthDate) {
    console.warn('Birth date is not set in the store.');
  }
});
</script>
