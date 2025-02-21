<template>
  <div class="bg-white shadow rounded p-6 max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">
      Finální krok: Zadejte novou očekávanou dobu života
    </h2>

    <div class="bg-gray-50 border border-gray-200 rounded p-4">
      <h3 class="text-lg font-semibold mb-2">Sumarizace výsledků</h3>
      <ul class="list-disc pl-5 text-gray-700">
        <li>
          <div class="flex items-center gap-x-1">
            <span>Datum narození: </span>
            <strong class="">{{ formatDate(questionnaireStore?.birthDate) }}</strong>
          </div>
        </li>
        <li>
          <div class="flex items-center gap-x-1">
            <span>Váš aktuální věk: </span>
            <strong class="">{{ questionnaireStore.getCurrentAge() }} let</strong>
          </div>
        </li>
        <li>
          <div class="flex items-center gap-x-1">
            <span>Základní očekávaná délka života: </span>
            <strong>{{ roundedBaseLifeExpectancy }} let</strong>
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.final.tooltips.baseLifeExpectancy')"
            ></i>
          </div>
        </li>
        <li>
          <div class="flex items-center gap-x-1">
            <span>Přínos vlivem fyzické aktivity: </span>
            <strong class="text-green-600">+{{ roundedActivityLifeGain }} let</strong>
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.final.tooltips.physicalActivity')"
            ></i>
          </div>
        </li>
        <li>
          <div class="flex items-center gap-x-1">
            <span>Přínos vlivem stravy: </span>
            <strong class="text-green-600">+{{ roundedDietLifeGain }} let</strong>
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.final.tooltips.food')"
            ></i>
          </div>
        </li>
        <li>
          <div class="flex items-center gap-x-1">
            <span>Ztráta vlivem alkoholu: </span>
            <strong class="text-red-600">-{{ roundedAlcoholLifeLoss }} let</strong>
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.final.tooltips.alcohol')"
            ></i>
          </div>
        </li>
        <li>
          <div class="flex items-center gap-x-1">
            <span>Ztráta vlivem dosavadního kouření: </span>
            <strong class="text-red-600">-{{ roundedSmokingLossYears }} let</strong>
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.final.tooltips.smokingLoss')"
            ></i>
          </div>
        </li>
        <li>
          <div class="flex items-center gap-x-1">
            <span>Ztráta vlivem budoucího kouření: </span>
            <strong class="text-red-600">-{{ roundedAdditionalSmokingLossYears }} let</strong>
          </div>
        </li>
        <li>
          <div class="flex items-center gap-x-1">
            <span>Očekávaná délka života ovlivněna faktory: </span>
            <strong>{{ roundedExpectedLifeExpectancy }} let</strong>
          </div>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const questionnaireStore = useQuestionnaireStore();

const roundOneDecimal = (num: number) => Math.round(num * 10) / 10;

const roundedBaseLifeExpectancy = computed(() => roundOneDecimal(questionnaireStore.baseLifeExpectancyForGender));
const roundedExpectedLifeExpectancy = computed(() => roundOneDecimal(questionnaireStore.finalLifeExpectancy));
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
