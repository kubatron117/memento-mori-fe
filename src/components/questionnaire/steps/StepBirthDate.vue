<template>
  <div class="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
      Zadejte datum narození
    </h2>
    <div class="space-y-6">
      <div>
        <label for="birthDate" class="block text-gray-700 font-medium mb-2">
          Datum narození:
        </label>
        <DatePicker
          v-model="localBirthDate"
          inputId="birthDate"
          dateFormat="dd.mm.yy"
          showIcon
          class="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import DatePicker from 'primevue/datepicker';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

const questionnaireStore = useQuestionnaireStore();
const localBirthDate = ref(questionnaireStore.birthDate);

watch(localBirthDate, (newVal) => {
  questionnaireStore.birthDate = newVal;
});
</script>

<style scoped>
</style>
