<template>
  <div>
    <h2>Kouření</h2>
    <div v-for="option in options" :key="option.label" class="p-field-radiobutton">
      <RadioButton
        v-model="selectedSmoking"
        :value="option.value"
        :inputId="`smoking_${option.label}`"
      />
      <label :for="`smoking_${option.label}`">{{ option.label }}</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import RadioButton from 'primevue/radiobutton';

const store = useQuestionnaireStore();
const selectedSmoking = computed({
  get: () => store.smoking,
  set: (val: boolean | null) => store.smoking = val,
});

const options = [
  { label: 'Ano', value: true },
  { label: 'Ne', value: false },
];
</script>
