<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Finální krok: Zadejte novou očekávanou dobu života</h2>

    <div class="mt-6 p-4 border rounded">
      <h3 class="font-semibold mb-2">Sumarizace výsledků</h3>
      <ul class="list-disc pl-5">
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
      </ul>
    </div>

    <div class="mt-6">
      <Slider
        v-model="adjustedExpectedLifetime"
        :min="1"
        :max="140"
        inputId="expectedLifetime"
        class="w-full"
      />
      <p class="mt-2">Zvolená nová doba: {{ roundedAdjustedExpectedLifetime }} let</p>
    </div>

    <div class="mt-4">
      <p class="text-lg font-bold">
        Nová celková očekávaná doba: {{ roundedAdjustedExpectedLifetime }} let
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Slider from 'primevue/slider';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

const questionnaireStore = useQuestionnaireStore();

// Výpočet základní očekávané délky života (nezávisle na slideru)
const baseLifeExpectancy = computed(() => {
  if (questionnaireStore.desiredAge !== null) {
    return questionnaireStore.desiredAge;
  } else if (questionnaireStore.lifeExpectancy) {
    if (questionnaireStore.gender === 'male' && questionnaireStore.lifeExpectancy.male !== null) {
      return questionnaireStore.lifeExpectancy.male;
    }
    if (questionnaireStore.gender === 'female' && questionnaireStore.lifeExpectancy.female !== null) {
      return questionnaireStore.lifeExpectancy.female;
    }
    return questionnaireStore.lifeExpectancy.both || 0;
  }
  return 0;
});

const activityLifeGain = computed(() => questionnaireStore.activityLifeGain);
const dietLifeGain = computed(() => questionnaireStore.dietLifeGain);
const alcoholLifeLoss = computed(() => questionnaireStore.alcoholLifeLoss);
const smokingLossYears = computed(() => questionnaireStore.smokingDaysLost / 365);
const additionalSmokingLossYears = computed(() => questionnaireStore.smokingAdditionalDaysLost / 365);

// Výpočet finální (nezměnitelné) hodnoty dle všech faktorů
const finalLifeExpectancy = computed(() =>
  baseLifeExpectancy.value +
  activityLifeGain.value +
  dietLifeGain.value -
  alcoholLifeLoss.value -
  smokingLossYears.value -
  additionalSmokingLossYears.value
);

const roundedBaseLifeExpectancy = computed(() => Math.round(baseLifeExpectancy.value));
const roundedActivityLifeGain = computed(() => Math.round(activityLifeGain.value));
const roundedDietLifeGain = computed(() => Math.round(dietLifeGain.value));
const roundedAlcoholLifeLoss = computed(() => Math.round(alcoholLifeLoss.value));
const roundedSmokingLossYears = computed(() => Math.round(smokingLossYears.value));
const roundedAdditionalSmokingLossYears = computed(() => Math.round(additionalSmokingLossYears.value));
const roundedFinalLifeExpectancy = computed(() => Math.round(finalLifeExpectancy.value));


const adjustedExpectedLifetime = ref(finalLifeExpectancy.value);

const roundedAdjustedExpectedLifetime = computed(() => Math.round(adjustedExpectedLifetime.value));
</script>
