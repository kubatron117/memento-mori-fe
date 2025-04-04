<template>
  <InfoTextBox></InfoTextBox>

  <div class="bg-white shadow rounded p-6 max-w-md mx-auto">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
      {{ t('app.stepEatingHabits.nationalityStep.title') }}
    </h2>
    <Select
      v-model="selectedNationality"
      :options="nationalities"
      optionLabel="location"
      optionValue="id"
      :placeholder="t('app.stepEatingHabits.nationalityStep.placeholder')"
      class="w-full"
      filter
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { LocationsApiService, type Location } from '@/api/locationsApiServise';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import Select from 'primevue/select';
import { LifeExpectanciesApiService } from '@/api/lifeExpectanciesApiService';
import InfoTextBox from '@/components/InfoTextBox.vue';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();

const store = useQuestionnaireStore();
const nationalities = ref<Location[]>([]);

const toast = useToast();

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
    toast.add({
      severity: 'error',
      summary: t('app.stepEatingHabits.nationalityStep.toasts.fetchNationalitiesError.summary'),
      detail: t('app.stepEatingHabits.nationalityStep.toasts.fetchNationalitiesError.detail'),
      life: 3000
    });
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
      toast.add({
        severity: 'error',
        summary: t('app.nationalityStep.toasts.fetchLifeExpectancyError.summary'),
        detail: t('app.nationalityStep.toasts.fetchLifeExpectancyError.detail'),
        life: 3000
      });
    }
  } else if (!store.birthDate) {
    console.warn('Birth date is not set in the store.');
    toast.add({
      severity: 'error',
      summary: t('app.nationalityStep.toasts.birthDateNotSet.summary'),
      detail: t('app.nationalityStep.toasts.birthDateNotSet.detail'),
      life: 3000
    });
  }
});
</script>
