<template>
  <div class="bg-white shadow rounded p-6 max-w-md mx-auto my-10">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
      {{ t('app.steps.insert-date-of-birth') }}
    </h2>
    <div>
      <label for="birthDate" class="block text-gray-700 font-medium mb-2">
        {{ t('app.steps.date-of-birth') }}:
      </label>
      <DatePicker
        v-model="localBirthDate"
        inputId="birthDate"
        dateFormat="dd.mm.yy"
        :minDate="minDate"
        :maxDate="today"
        :manualInput="true"
        showIcon
        class="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref, watch } from 'vue';
import DatePicker from 'primevue/datepicker';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import { useI18n } from 'vue-i18n'

const questionnaireStore = useQuestionnaireStore();
const localBirthDate = ref(questionnaireStore.birthDate);

watch(localBirthDate, (newVal) => {
  questionnaireStore.birthDate = newVal;
});

const { t } = useI18n()

const today = new Date();
const minDate = new Date(today.getFullYear() - 139, today.getMonth(), today.getDate());
</script>

<style scoped>
</style>
