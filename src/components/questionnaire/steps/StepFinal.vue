<template>
  <div class="bg-white shadow rounded p-6 max-w-2xl mx-auto">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">
      Finální krok: Odhadovaný věk dožití
    </h2>

    <div class="bg-gray-50 border border-gray-200 rounded p-4">
      <h3 class="text-lg font-semibold mb-2">Sumarizace výsledků</h3>
      <ul class="list-disc pl-5 text-gray-700">
        <li>
          <div class="flex items-center justify-between md:justify-normal gap-x-1">
            <span>Datum narození: <strong>{{ formatDate(questionnaireStore?.birthDate) }}</strong></span>
          </div>
        </li>
        <li>
          <div class="flex items-center justify-between md:justify-normal gap-x-1">
            <span>Váš aktuální věk: <strong>{{ questionnaireStore.getCurrentAge() }} let</strong></span>
          </div>
        </li>
        <li>
          <div class="flex items-center justify-between md:justify-normal gap-x-1">
            <span>Základní očekávaná délka života: <strong>{{ roundedBaseLifeExpectancy }} let</strong></span>
            <InfoModal label="Základní očekávaná délka života"
                       :studyTitle="t('app.steps.final.tooltips.baseLifeExpectancy')"
                       studyLink="https://population.un.org/wpp/downloads?folder=Standard%20Projections&group=CSV%20format"
            />
          </div>
        </li>
        <li>
          <div class="flex items-center justify-between md:justify-normal gap-x-1">
            <span>Přínos vlivem fyzické aktivity: <strong class="text-green-600">+{{ roundedActivityLifeGain }} let</strong></span>
            <InfoModal label="Přínos vlivem fyzické aktivity"
                       :studyTitle="t('app.steps.final.tooltips.physicalActivity')"
                       studyLink="https://www.ahajournals.org/doi/10.1161/jaha.117.007725"
            />
          </div>
        </li>
        <li>
          <div class="flex items-center justify-between md:justify-normal gap-x-1">
            <span>Přínos vlivem stravy: <strong class="text-green-600">+{{ roundedDietLifeGain }} let</strong></span>
            <InfoModal label="Přínos vlivem stravy"
                       :studyTitle="t('app.steps.final.tooltips.food')"
                       studyLink="https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1003889"
            />
          </div>
        </li>
        <li>
          <div class="flex items-center justify-between md:justify-normal gap-x-1">
            <span>Ztráta vlivem alkoholu: <strong class="text-red-600">-{{ roundedAlcoholLifeLoss }} let</strong></span>
            <InfoModal label="Ztráta vlivem alkoholu"
                       :studyTitle="t('app.steps.final.tooltips.alcohol')"
                       studyLink="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)30134-X/fulltext"
            />
          </div>
        </li>
        <li>
          <div class="flex items-center justify-between md:justify-normal gap-x-1">
            <span>Ztráta vlivem dosavadního kouření: <strong class="text-red-600">-{{ roundedSmokingLossYears }} let</strong></span>
            <InfoModal label="Ztráta vlivem dosavadního kouření"
                       :studyTitle="t('app.steps.final.tooltips.smokingLoss')"
                       studyLink="https://onlinelibrary.wiley.com/doi/10.1111/add.16757"
            />
          </div>
        </li>
        <li>
          <div class="flex items-center justify-between md:justify-normal gap-x-1">
            <span>Ztráta vlivem budoucího kouření: <strong class="text-red-600">-{{ roundedAdditionalSmokingLossYears }} let</strong></span>
          </div>
        </li>
        <li>
          <div class="flex items-center justify-between md:justify-normal gap-x-1">
            <span>Očekávaná délka života ovlivněna faktory: <strong>{{ roundedExpectedLifeExpectancy }} let</strong></span>
          </div>
        </li>
      </ul>
    </div>

    <div class="mt-6">
      <label for="expectedLifetime" class="block text-gray-700 font-medium mb-2">
        Zde můžete očekávanou délku života změnit:
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
        Věk pro který se vygeneruje memonto mori kalendář: {{ roundedAdjustedExpectedLifetime }} let
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import Slider from 'primevue/slider';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import { useI18n } from 'vue-i18n'
import InfoModal from '@/components/InfoModal.vue';

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
