<template>
  <div class="bg-white shadow rounded p-6 max-w-md mx-auto">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
      {{ t('app.steps.choose-gender') }}
    </h2>
    <div class="space-y-4">
      <div v-for="gender in genders" :key="gender.value" class="flex items-center">
        <RadioButton
          v-model="selectedGender"
          :value="gender.value"
          :inputId="`gender_${gender.value}`"
        />
        <label :for="`gender_${gender.value}`" class="ml-2 cursor-pointer text-gray-700">
          {{ gender.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import RadioButton from 'primevue/radiobutton';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useQuestionnaireStore();

const selectedGender = computed({
  get: () => store.gender,
  set: (val: string) => {
    store.updateGender(val);
  },
});

const genders = [
  { label: t('app.steps.male'), value: 'male' },
  { label: t('app.steps.female'), value: 'female' },
  { label: t('app.steps.other'), value: 'other' },
];

</script>
