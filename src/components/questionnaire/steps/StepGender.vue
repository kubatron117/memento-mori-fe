<template>
  <div>
    <h2>Vyberte pohlaví</h2>
    <div v-for="gender in genders" :key="gender.value" class="p-field-radiobutton">
      <RadioButton
        v-model="selectedGender"
        :value="gender.value"
        :inputId="`gender_${gender.value}`"
      />
      <label :for="`gender_${gender.value}`">{{ gender.label }}</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import RadioButton from 'primevue/radiobutton';

const store = useQuestionnaireStore();
const selectedGender = computed({
  get: () => store.gender,
  set: (val: string | null) => store.gender = val,
});

const genders = [
  { label: 'Muž', value: 'male' },
  { label: 'Žena', value: 'female' },
  { label: 'Jiné', value: 'other' },
];
</script>
