<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { LocationsApiService, Location } from '@/api/locationsApiServise';
import Select from 'primevue/select';

const locations = ref<Location[]>([]);
const selectedLocationUrl = ref<string | null>(null);

onMounted(async () => {
  try {
    locations.value = await LocationsApiService.getLocations();
  } catch (error) {
    console.error('Error fetching locations:', error);
  }
});
</script>

<template>
  <div>
    <h1>Select a Location</h1>
    <Select
      v-model="selectedLocationUrl"
      :options="locations"
      optionLabel="location"
      optionValue="url"
      placeholder="Select a location"
      class="w-full md:w-56"
      filter
    />
    <div v-if="selectedLocationUrl" class="mt-2">
      <p>Selected Location URL: {{ selectedLocationUrl }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>
