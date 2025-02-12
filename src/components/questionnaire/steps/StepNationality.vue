<template>
  <div>
    <h2>Vyberte národnost</h2>
    <Select
      v-model="selectedNationality"
      :options="nationalities"
      optionLabel="location"
      optionValue="url"
      placeholder="Vyberte národnost"
      class="w-full md:w-56"
      filter
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { LocationsApiService, type Location } from '@/api/locationsApiServise';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import Select from 'primevue/select';

const store = useQuestionnaireStore();
const nationalities = ref<Location[]>([]);

const selectedNationality = computed({
  get: () => store.nationality,
  set: (val: string | null) => store.nationality = val,
});

onMounted(async () => {
  try {
    nationalities.value = await LocationsApiService.getLocations();
  } catch (error) {
    console.error('Error fetching nationalities:', error);
  }
});
</script>
