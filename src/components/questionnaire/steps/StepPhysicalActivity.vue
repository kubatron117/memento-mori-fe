<template>
  <div>
    <h2>Fyzická aktivita</h2>
    <div v-for="option in options" :key="option.value" class="p-field-radiobutton">
      <RadioButton
        v-model="selectedPhysicalActivity"
        :value="option.value"
        :inputId="`activity_${option.value}`"
      />
      <label :for="`activity_${option.value}`">{{ option.label }}</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import RadioButton from 'primevue/radiobutton';

const store = useQuestionnaireStore();
const selectedPhysicalActivity = computed({
  get: () => store.physicalActivity,
  set: (val: string | null) => store.physicalActivity = val,
});

const options = [
  { label: 'Ne', value: 'none' },
  { label: 'Ano', value: 'yes' },
  { label: 'Ano pravidelná', value: 'regular' },
];
</script>
