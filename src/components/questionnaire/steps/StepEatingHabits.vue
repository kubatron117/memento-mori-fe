<template>
  <div>
    <h2>Stravovací návyky</h2>
    <div v-for="option in options" :key="option.value" class="p-field-radiobutton">
      <RadioButton
        v-model="selectedEatingHabits"
        :value="option.value"
        :inputId="`eating_${option.value}`"
      />
      <label :for="`eating_${option.value}`">{{ option.label }}</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import RadioButton from 'primevue/radiobutton';

const store = useQuestionnaireStore();
const selectedEatingHabits = computed({
  get: () => store.eatingHabits,
  set: (val: string | null) => store.eatingHabits = val,
});

const options = [
  { label: 'Dobré', value: 'good' },
  { label: 'Špatné', value: 'bad' },
];
</script>
