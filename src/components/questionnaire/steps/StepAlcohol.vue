<template>
  <div>
    <h2>Konzumace alkoholu</h2>
    <div v-for="option in options" :key="option.value" class="p-field-radiobutton">
      <RadioButton
        v-model="selectedAlcohol"
        :value="option.value"
        :inputId="`alcohol_${option.value}`"
      />
      <label :for="`alcohol_${option.value}`">{{ option.label }}</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import RadioButton from 'primevue/radiobutton';

const store = useQuestionnaireStore();
const selectedAlcohol = computed({
  get: () => store.alcohol,
  set: (val: string | null) => store.alcohol = val,
});

const options = [
  { label: 'Ne', value: 'none' },
  { label: 'Trochu', value: 'little' },
  { label: 'Hodně', value: 'a lot' },
];
</script>
