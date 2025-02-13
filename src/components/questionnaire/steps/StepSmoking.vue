<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Kouření</h2>

    <div class="mb-4">
      <label class="block mb-2 font-medium">Kouříte?</label>
      <div class="flex items-center space-x-4">
        <RadioButton v-model="smokes" :value="true" inputId="smoke-yes" />
        <label for="smoke-yes" class="cursor-pointer">Ano</label>
        <RadioButton v-model="smokes" :value="false" inputId="smoke-no" />
        <label for="smoke-no" class="cursor-pointer">Ne</label>
      </div>
    </div>

    <div v-if="smokes" class="space-y-4">
      <div>
        <label for="startAge" class="block mb-2 font-medium">Od kolika let kouříte?</label>
        <InputNumber
          id="startAge"
          v-model="startAge"
          class="w-full"
          :min="0"
          :showButtons="true"
        />
      </div>
      <div>
        <label for="cigarettesPerDay" class="block mb-2 font-medium">Kolik cigaret denně?</label>
        <InputNumber
          id="cigarettesPerDay"
          v-model="cigarettesPerDay"
          class="w-full"
          :min="0"
          :showButtons="true"
        />
      </div>
      <div>
        <label for="plannedQuitAge" class="block mb-2 font-medium">Dokud plánujete kouřit? (volitelně)</label>
        <InputNumber
          id="plannedQuitAge"
          v-model="plannedQuitAge"
          class="w-full"
          :min="0"
          :showButtons="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useLifeLossSmokingStore } from '@/stores/lifeLossSmokingStore';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';

const lifeLossSmokingStore = useLifeLossSmokingStore();
const questionnaireStore = useQuestionnaireStore();

const smokes = ref<boolean | null>(lifeLossSmokingStore.smoking);
const startAge = ref<number | null>(lifeLossSmokingStore.startAge);
const cigarettesPerDay = ref<number | null>(lifeLossSmokingStore.cigarettesPerDay);
const plannedQuitAge = ref<number | null>(lifeLossSmokingStore.plannedQuitAge);

const calculateAndStore = () => {
  lifeLossSmokingStore.calculateLifeLoss(questionnaireStore.gender, questionnaireStore.birthDate);
  questionnaireStore.smokingDaysLost = lifeLossSmokingStore.daysLost;
  questionnaireStore.smokingAdditionalDaysLost = lifeLossSmokingStore.additionalDaysLost;
};

watch(smokes, (newValue) => {
  lifeLossSmokingStore.smoking = newValue;
  if (newValue === false) {
    startAge.value = null;
    cigarettesPerDay.value = null;
    plannedQuitAge.value = null;
    lifeLossSmokingStore.startAge = null;
    lifeLossSmokingStore.cigarettesPerDay = null;
    lifeLossSmokingStore.plannedQuitAge = null;
  }
  calculateAndStore();
});

watch(startAge, (newValue) => {
  lifeLossSmokingStore.startAge = newValue;
  calculateAndStore();
});

watch(cigarettesPerDay, (newValue) => {
  lifeLossSmokingStore.cigarettesPerDay = newValue;
  calculateAndStore();
});

watch(plannedQuitAge, (newValue) => {
  lifeLossSmokingStore.plannedQuitAge = newValue;
  calculateAndStore();
});

onMounted(() => {
  smokes.value = lifeLossSmokingStore.smoking;
  startAge.value = lifeLossSmokingStore.startAge;
  cigarettesPerDay.value = lifeLossSmokingStore.cigarettesPerDay;
  plannedQuitAge.value = lifeLossSmokingStore.plannedQuitAge;
  calculateAndStore();
});
</script>

<style scoped>
</style>
