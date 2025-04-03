<template>
  <InfoTextBox></InfoTextBox>
  <div class="bg-white shadow rounded p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      {{ t('app.stepEatingHabits.title') }}
    </h2>

    <p class="text-gray-700 font-medium mb-4">
      {{ t('app.stepEatingHabits.question') }}
    </p>
    <div class="space-y-4">
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="typical"
          inputId="typical"
        />
        <label for="typical" class="ml-2 cursor-pointer text-gray-700">
          {{ t('app.stepEatingHabits.dietOptions.typical') }}
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="feasible"
          inputId="feasible"
        />
        <label for="feasible" class="ml-2 cursor-pointer text-gray-700">
          {{ t('app.stepEatingHabits.dietOptions.feasible') }}
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="optimal"
          inputId="optimal"
        />
        <label for="optimal" class="ml-2 cursor-pointer text-gray-700">
          {{ t('app.stepEatingHabits.dietOptions.optimal') }}
        </label>
      </div>
    </div>

    <div
      v-if="(questionnaireStore.eatingHabits !== 'typical' && questionnaireStore.eatingHabits !== null) && currentAge > 20"
      class="mt-6"
    >
      <p class="text-gray-700 font-medium mb-2">
        {{ t('app.stepEatingHabits.dietStartAgeLabel') }}
      </p>
      <input
        type="number"
        v-model.number="questionnaireStore.dietStartAge"
        :min="20"
        :max="currentAge"
        class="border rounded p-2 w-full"
      />
    </div>

    <div class="mt-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">
        {{ t('app.stepEatingHabits.table.title') }}
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left text-sm text-gray-700">
          <thead>
          <tr class="bg-gray-100 border-b">
            <th class="p-2 font-semibold text-gray-800">
              {{ t('app.stepEatingHabits.table.headers.food') }}
            </th>
            <th class="p-2 font-semibold text-gray-800">
              {{ t('app.stepEatingHabits.table.headers.typical') }}
            </th>
            <th class="p-2 font-semibold text-gray-800">
              {{ t('app.stepEatingHabits.table.headers.feasible') }}
            </th>
            <th class="p-2 font-semibold text-gray-800">
              {{ t('app.stepEatingHabits.table.headers.optimal') }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, idx) in dietComparison" :key="idx" class="border-b">
            <td class="p-2">{{ item.food }}</td>
            <td class="p-2">{{ item.typical }} g</td>
            <td class="p-2">{{ item.feasible }} g</td>
            <td class="p-2">{{ item.optimal }} g</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import RadioButton from 'primevue/radiobutton';
import { useDietStore } from '@/stores/lifeGainEatingStore';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import InfoTextBox from '@/components/InfoTextBox.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dietStore = useDietStore();
const questionnaireStore = useQuestionnaireStore();

const currentAge = computed(() => questionnaireStore.getCurrentAge());

const dietComparison = [
  { food: t('app.stepEatingHabits.dietComparisonFoods.wholeGrains'), typical: 50, feasible: 137.5, optimal: 225 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.vegetables'), typical: 250, feasible: 325, optimal: 400 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.fruits'), typical: 200, feasible: 300, optimal: 400 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.nuts'), typical: 0, feasible: 12.5, optimal: 25 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.legumes'), typical: 0, feasible: 100, optimal: 200 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.fish'), typical: 50, feasible: 125, optimal: 200 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.eggs'), typical: 50, feasible: 37.5, optimal: 25 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.dairy'), typical: 300, feasible: 250, optimal: 200 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.refinedGrains'), typical: 150, feasible: 100, optimal: 50 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.redMeat'), typical: 100, feasible: 50, optimal: 0 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.processedMeat'), typical: 50, feasible: 25, optimal: 0 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.whiteMeat'), typical: 75, feasible: 62.5, optimal: 50 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.sweetenedBeverages'), typical: 500, feasible: 250, optimal: 0 },
  { food: t('app.stepEatingHabits.dietComparisonFoods.addedOils'), typical: 25, feasible: 25, optimal: 25 }
];
</script>

<style scoped>
</style>
