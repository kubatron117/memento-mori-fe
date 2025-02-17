<template>
  <div>
    <h2>{{ t('app.steps.choose-gender')}}</h2>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const store = useQuestionnaireStore();
const selectedGender = computed({
  get: () => store.gender,
  set: (val: string | null) => store.gender = val,
});

const genders = [
  { label: t('app.steps.male'), value: 'male' },
  { label: t('app.steps.female'), value: 'female' },
  { label: t('app.steps.other'), value: null },
];
</script>
