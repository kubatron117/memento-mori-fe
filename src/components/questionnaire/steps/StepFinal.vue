<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">
      Finální krok: Zadejte novou očekávanou dobu života
    </h2>

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
      <p class="mt-2">
        Zvolená nová doba: {{ roundedAdjustedExpectedLifetime }} let
      </p>
    </div>

    <div class="mt-4">
      <p class="text-lg font-bold">
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

const defaultLifeExpectancy = computed(() => {
  if (questionnaireStore.desiredAge && questionnaireStore.desiredAge !== 0) {
    return questionnaireStore.desiredAge;
  } else if (
    questionnaireStore.desiredAgeCalculated &&
    questionnaireStore.desiredAgeCalculated !== 0
  ) {
    return questionnaireStore.desiredAgeCalculated;
  } else {
    return questionnaireStore.calculateAdjustedLifeExpectancy();
  }
});

const baseLifeExpectancy = computed(() => {
  if (questionnaireStore.desiredAge && questionnaireStore.desiredAge !== 0) {
    return questionnaireStore.desiredAge;
  } else if (questionnaireStore.desiredAgeCalculated && questionnaireStore.desiredAgeCalculated !== 0) {
    return questionnaireStore.desiredAgeCalculated;
  } else if (questionnaireStore.lifeExpectancy) {
    if (
      questionnaireStore.gender === 'male' &&
      questionnaireStore.lifeExpectancy.male !== null
    ) {
      return questionnaireStore.lifeExpectancy.male;
    }
    if (
      questionnaireStore.gender === 'female' &&
      questionnaireStore.lifeExpectancy.female !== null
    ) {
      return questionnaireStore.lifeExpectancy.female;
    }
    return questionnaireStore.lifeExpectancy.both || 0;
  }
  return 0;
});

const roundedBaseLifeExpectancy = computed(() =>
  roundOneDecimal(baseLifeExpectancy.value)
);
const roundedActivityLifeGain = computed(() =>
  roundOneDecimal(questionnaireStore.activityLifeGain)
);
const roundedDietLifeGain = computed(() =>
  roundOneDecimal(questionnaireStore.dietLifeGain)
);
const roundedAlcoholLifeLoss = computed(() =>
  roundOneDecimal(questionnaireStore.alcoholLifeLoss)
);
const roundedSmokingLossYears = computed(() =>
  roundOneDecimal(questionnaireStore.smokingDaysLost / 365)
);
const roundedAdditionalSmokingLossYears = computed(() =>
  roundOneDecimal(questionnaireStore.smokingAdditionalDaysLost / 365)
);

const adjustedExpectedLifetime = ref(defaultLifeExpectancy.value);

watch(
  defaultLifeExpectancy,
  (newVal) => {
    adjustedExpectedLifetime.value = newVal;
  },
  { immediate: true }
);

const roundedAdjustedExpectedLifetime = computed(() =>
  Math.round(adjustedExpectedLifetime.value)
);
</script>
