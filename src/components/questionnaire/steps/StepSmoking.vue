<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">{{ t('app.steps.smoking') }}</h2>

    <div class="mb-4">
      <label class="block mb-2 font-medium">{{ t('app.steps.do-you-smoke') }}</label>
      <div class="flex items-center space-x-4">
        <RadioButton v-model="smokes" :value="true" inputId="smoke-yes" />
        <label for="smoke-yes" class="cursor-pointer">{{ t('app.steps.yes') }}</label>
        <RadioButton v-model="smokes" :value="false" inputId="smoke-no" />
        <label for="smoke-no" class="cursor-pointer">{{ t('app.steps.no') }}</label>
      </div>
    </div>

    <div v-if="smokes" class="space-y-4">
      <div>
        <label for="startAge" class="block mb-2 font-medium">
          {{ t('app.steps.start-age-smoking') }}
        </label>
        <InputNumber
          id="startAge"
          v-model="startAge"
          class="w-full"
          :min="0"
          :max="currentAge"
          :showButtons="true"
        />
      </div>
      <div>
        <label for="cigarettesPerDay" class="block mb-2 font-medium">
          {{ t('app.steps.cigarettes-per-day') }}
        </label>
        <InputNumber
          id="cigarettesPerDay"
          v-model="cigarettesPerDay"
          class="w-full"
          :min="0"
          :max="150"
          :showButtons="true"
        />
      </div>
      <div>
        <label for="plannedQuitAge" class="block mb-2 font-medium">
          {{ t('app.steps.planned-quit-age') }} ({{ t('app.optional') }})
        </label>
        <InputNumber
          id="plannedQuitAge"
          v-model="plannedQuitAge"
          class="w-full"
          :min="0"
          :max="140"
          :showButtons="true"
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
});

watch(cigarettesPerDay, (newValue) => {
  lifeLossSmokingStore.cigarettesPerDay = newValue;
});

watch(plannedQuitAge, (newValue) => {
  lifeLossSmokingStore.plannedQuitAge = newValue;
});

onMounted(() => {
  smokes.value = lifeLossSmokingStore.smoking;
  startAge.value = lifeLossSmokingStore.startAge;
  cigarettesPerDay.value = lifeLossSmokingStore.cigarettesPerDay;
  plannedQuitAge.value = lifeLossSmokingStore.plannedQuitAge;
});
</script>

<style scoped>
</style>
