<template>
  <div class="bg-white shadow rounded p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      {{ t('app.steps.smoking') }}
    </h2>

    <div class="mb-6">
      <label class="block text-gray-700 font-medium mb-2">
        {{ t('app.steps.do-you-smoke') }}
      </label>
      <div class="flex items-center space-x-6">
        <div class="flex items-center">
          <RadioButton v-model="smokes" :value="true" inputId="smoke-yes" />
          <label for="smoke-yes" class="ml-2 cursor-pointer text-gray-700">
            {{ t('app.steps.yes') }}
          </label>
        </div>
        <div class="flex items-center">
          <RadioButton v-model="smokes" :value="false" inputId="smoke-no" />
          <label for="smoke-no" class="ml-2 cursor-pointer text-gray-700">
            {{ t('app.steps.no') }}
          </label>
        </div>
      </div>
    </div>

    <div v-if="smokes" class="mb-6">
      <label class="block text-gray-700 font-medium mb-2">
        {{ t('app.steps.plan-to-quit') }}
      </label>
      <div class="flex items-center space-x-6">
        <div class="flex items-center">
          <RadioButton v-model="planToQuit" :value="true" inputId="quit-yes" />
          <label for="quit-yes" class="ml-2 cursor-pointer text-gray-700">
            {{ t('app.steps.yes') }}
          </label>
        </div>
        <div class="flex items-center">
          <RadioButton v-model="planToQuit" :value="false" inputId="quit-no" />
          <label for="quit-no" class="ml-2 cursor-pointer text-gray-700">
            {{ t('app.steps.no') }}
          </label>
        </div>
      </div>
    </div>
    <div v-if="smokes" class="space-y-6">
      <div>
        <label for="startAge" class="block text-gray-700 font-medium mb-2">
          {{ t('app.steps.start-age-smoking') }}
        </label>
        <InputNumber
          id="startAge"
          v-model="startAge"
          class="w-full"
          :min="0"
          :max="currentAge"
          showButtons
        />
      </div>
      <div>
        <label for="cigarettesPerDay" class="block text-gray-700 font-medium mb-2">
          {{ t('app.steps.cigarettes-per-day') }}
        </label>
        <InputNumber
          id="cigarettesPerDay"
          v-model="cigarettesPerDay"
          class="w-full"
          :min="0"
          :max="150"
          showButtons
        />
      </div>
      <div v-if="planToQuit">
        <label for="plannedQuitAge" class="block text-gray-700 font-medium mb-2">
          {{ t('app.steps.planned-quit-age') }}
        </label>
        <InputNumber
          id="plannedQuitAge"
          v-model="plannedQuitAge"
          class="w-full"
          :min="startAge || 0"
          :max="140"
          showButtons
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLifeLossSmokingStore } from '@/stores/lifeLossSmokingStore'
import { useQuestionnaireStore } from '@/stores/questionnaireStore'
import RadioButton from 'primevue/radiobutton'
import InputNumber from 'primevue/inputnumber'

const { t } = useI18n()

const lifeLossSmokingStore = useLifeLossSmokingStore();
const questionnaireStore = useQuestionnaireStore();

const smokes = ref<boolean | null>(lifeLossSmokingStore.smoking);
const startAge = ref<number | null>(lifeLossSmokingStore.startAge);
const cigarettesPerDay = ref<number | null>(lifeLossSmokingStore.cigarettesPerDay);
const plannedQuitAge = ref<number | null>(lifeLossSmokingStore.plannedQuitAge);
const planToQuit = ref<boolean>(lifeLossSmokingStore.planToQuit ?? false);
const currentAge = computed(() => questionnaireStore.getCurrentAge());

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
});

watch(startAge, (newValue) => {
  lifeLossSmokingStore.startAge = newValue;
  if (plannedQuitAge.value !== null && newValue !== null && plannedQuitAge.value < newValue) {
    plannedQuitAge.value = newValue;
  }
});

watch(cigarettesPerDay, (newValue) => {
  lifeLossSmokingStore.cigarettesPerDay = newValue;
});

watch(plannedQuitAge, (newValue) => {
  if (newValue !== null && startAge.value !== null && newValue < startAge.value) {
    plannedQuitAge.value = startAge.value;
  }
  lifeLossSmokingStore.plannedQuitAge = plannedQuitAge.value;
});

watch(planToQuit, (newValue) => {
  lifeLossSmokingStore.planToQuit = newValue;
});

onMounted(() => {
  smokes.value = lifeLossSmokingStore.smoking;
  startAge.value = lifeLossSmokingStore.startAge;
  cigarettesPerDay.value = lifeLossSmokingStore.cigarettesPerDay;
  plannedQuitAge.value = lifeLossSmokingStore.plannedQuitAge;
  planToQuit.value = lifeLossSmokingStore.planToQuit ?? false;
});
</script>

<style scoped>
</style>
