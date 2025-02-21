<template>
  <div class="bg-white shadow rounded p-6 max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">
      Finální krok: Zadejte novou očekávanou dobu života
    </h2>

    <div class="bg-gray-50 border border-gray-200 rounded p-4">
      <h3 class="text-lg font-semibold mb-2">Sumarizace výsledků</h3>
      <ul class="list-disc pl-5 text-gray-700">
        <li>
          <span>Základní očekávaná délka života: </span>
          <strong>{{ roundedBaseLifeExpectancy }} let</strong>
        </li>
        <li>
          <span>Přínos fyzické aktivity: </span>
          <strong class="text-green-600">+{{ roundedActivityLifeGain }} let</strong>
        </li>
        <li>
          <span>Přínos diety: </span>
          <strong class="text-green-600">+{{ roundedDietLifeGain }} let</strong>
        </li>
        <li>
          <span>Ztráta vlivem alkoholu: </span>
          <strong class="text-red-600">-{{ roundedAlcoholLifeLoss }} let</strong>
        </li>
        <li>
          <span>Ztráta vlivem kouření: </span>
          <strong class="text-red-600">-{{ roundedSmokingLossYears }} let</strong>
        </li>
        <li>
          <span>Další ztráty z kouření: </span>
          <strong class="text-red-600">-{{ roundedAdditionalSmokingLossYears }} let</strong>
        </li>
        <li>
          <span>Datum narození: </span>
          <strong class="">{{ formatDate(questionnaireStore?.birthDate) }}</strong>
        </li>
        <li>
          <span>Váš aktuální věk: </span>
          <strong class="">{{ questionnaireStore.getCurrentAge() }} let</strong>
        </li>
      </ul>
    </div>

    <div class="mt-6">
      <label for="expectedLifetime" class="block text-gray-700 font-medium mb-2">
        Nastavte novou očekávanou dobu:
      </label>
      <Slider
        v-model="adjustedExpectedLifetime"
        :min="minExpectedLifetime"
        :max="140"
        inputId="expectedLifetime"
        class="w-full"
      />
      <p class="mt-2 text-gray-700">
        Zvolená nová doba: {{ roundedAdjustedExpectedLifetime }} let
      </p>
    </div>

    <div class="mt-4">
      <p class="text-lg font-bold text-gray-800">
        Nová celková očekávaná doba: {{ roundedAdjustedExpectedLifetime }} let
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import Slider from 'primevue/slider';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

const questionnaireStore = useQuestionnaireStore();

const roundOneDecimal = (num: number) => Math.round(num * 10) / 10;

const roundedBaseLifeExpectancy = computed(() => roundOneDecimal(questionnaireStore.baseLifeExpectancyForGender));
const roundedActivityLifeGain = computed(() => roundOneDecimal(questionnaireStore.activityLifeGain));
const roundedDietLifeGain = computed(() => roundOneDecimal(questionnaireStore.dietLifeGain));
const roundedAlcoholLifeLoss = computed(() => roundOneDecimal(questionnaireStore.alcoholLifeLoss));
const roundedSmokingLossYears = computed(() => roundOneDecimal(questionnaireStore.smokingDaysLost / 365));
const roundedAdditionalSmokingLossYears = computed(() => roundOneDecimal(questionnaireStore.smokingAdditionalDaysLost / 365));

const minExpectedLifetime = computed(() => questionnaireStore.getCurrentAge() + 1);

const defaultLifeExpectancy = computed(() => {
  const def = questionnaireStore.finalLifeExpectancy;
  return def < minExpectedLifetime.value ? minExpectedLifetime.value : def;
});

const adjustedExpectedLifetime = ref(defaultLifeExpectancy.value);

const formatDate = (date: Date | null): string => {
  if (date == null) return "";
  return date.toLocaleDateString('cs-CZ');
};

watch(
  defaultLifeExpectancy,
  (newVal) => {
    adjustedExpectedLifetime.value = newVal;
  },
  { immediate: true }
);

watch(
  adjustedExpectedLifetime,
  (newVal) => {
    questionnaireStore.$patch({ desiredAge: newVal });
  }, { immediate: true }
);

const roundedAdjustedExpectedLifetime = computed(() => Math.round(adjustedExpectedLifetime.value));
</script>
