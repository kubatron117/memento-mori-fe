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
          <RadioButton v-model="smokes" :value="'yes'" inputId="smoke-yes" />
          <label for="smoke-yes" class="ml-2 cursor-pointer text-gray-700">
            {{ t('app.steps.yes') }}
          </label>
        </div>

        <div class="flex items-center">
          <RadioButton v-model="smokes" :value="'no'" inputId="smoke-no" />
          <label for="smoke-no" class="ml-2 cursor-pointer text-gray-700">
            {{ t('app.steps.no') }}
          </label>
        </div>

        <div class="flex items-center">
          <RadioButton v-model="smokes" :value="'past'" inputId="smoke-past" />
          <label for="smoke-past" class="ml-2 cursor-pointer text-gray-700">
            {{ t('app.steps.past-smoker') }}
          </label>
        </div>
      </div>
    </div>

    <div v-if="smokes === 'yes'" class="space-y-6">
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
      <div>
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
      <div v-if="planToQuit">
        <label class="block text-gray-700 font-medium mb-2">
          {{ t('app.steps.quit-timeframe') }}
        </label>
        <div class="flex items-center space-x-6">
          <div class="flex items-center">
            <RadioButton v-model="quitTimeFrame" :value="0.25" inputId="quit-3m" />
            <label for="quit-3m" class="ml-2 cursor-pointer text-gray-700">
              {{ t('app.steps.in-3-months') }}
            </label>
          </div>
          <div class="flex items-center">
            <RadioButton v-model="quitTimeFrame" :value="0.5" inputId="quit-6m" />
            <label for="quit-6m" class="ml-2 cursor-pointer text-gray-700">
              {{ t('app.steps.in-6-months') }}
            </label>
          </div>
          <div class="flex items-center">
            <RadioButton v-model="quitTimeFrame" :value="1" inputId="quit-1y" />
            <label for="quit-1y" class="ml-2 cursor-pointer text-gray-700">
              {{ t('app.steps.in-1-year') }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="smokes === 'past'" class="space-y-6">
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

      <div>
        <label for="stopAge" class="block text-gray-700 font-medium mb-2">
          {{ t('app.steps.stop-age-smoking') }}
        </label>
        <InputNumber
          id="stopAge"
          v-model="stopAge"
          class="w-full"
          :min="startAge || 0"
          :max="currentAge"
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

const smokes = ref<string | null>(lifeLossSmokingStore.smoking);
const startAge = ref<number | null>(lifeLossSmokingStore.startAge);
const cigarettesPerDay = ref<number | null>(lifeLossSmokingStore.cigarettesPerDay);
const planToQuit = ref<boolean>(lifeLossSmokingStore.planToQuit ?? false);
const quitTimeFrame = ref<number | null>(lifeLossSmokingStore.quitTimeFrame);
const stopAge = ref<number | null>(lifeLossSmokingStore.stopAge);
const currentAge = computed(() => questionnaireStore.getCurrentAge());

watch(smokes, (newValue) => {
  lifeLossSmokingStore.smoking = newValue;
  if(newValue === 'no'){
    startAge.value = null;
    cigarettesPerDay.value = null;
    planToQuit.value = false;
    quitTimeFrame.value = null;
    lifeLossSmokingStore.startAge = null;
    lifeLossSmokingStore.cigarettesPerDay = null;
    lifeLossSmokingStore.planToQuit = false;
    lifeLossSmokingStore.quitTimeFrame = null;
    lifeLossSmokingStore.stopAge = null;
  } else if(newValue === 'past'){
    planToQuit.value = false;
    quitTimeFrame.value = null;
    lifeLossSmokingStore.planToQuit = false;
    lifeLossSmokingStore.quitTimeFrame = null;
  }
});

watch(startAge, (newValue) => {
  lifeLossSmokingStore.startAge = newValue;
});

watch(cigarettesPerDay, (newValue) => {
  lifeLossSmokingStore.cigarettesPerDay = newValue;
});

watch(planToQuit, (newValue) => {
  lifeLossSmokingStore.planToQuit = newValue;
  if (!newValue) {
    quitTimeFrame.value = null;
    lifeLossSmokingStore.quitTimeFrame = null;
  }
});

watch(quitTimeFrame, (newValue) => {
  lifeLossSmokingStore.quitTimeFrame = newValue;
});

watch(stopAge, (newValue) => {
  lifeLossSmokingStore.stopAge = newValue;
});

onMounted(() => {
  smokes.value = lifeLossSmokingStore.smoking;
  startAge.value = lifeLossSmokingStore.startAge;
  cigarettesPerDay.value = lifeLossSmokingStore.cigarettesPerDay;
  planToQuit.value = lifeLossSmokingStore.planToQuit ?? false;
  quitTimeFrame.value = lifeLossSmokingStore.quitTimeFrame;
  stopAge.value = lifeLossSmokingStore.stopAge;
});
</script>

<style scoped>
</style>
