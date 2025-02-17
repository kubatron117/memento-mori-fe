<template>
  <div class="bg-white shadow rounded p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      Kalkulačka stravy a prodloužení života
    </h2>

    <p class="text-gray-700 font-medium mb-4">Jakou stravu máte?</p>
    <div class="space-y-4">
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="typical"
          inputId="typical"
        />
        <label for="typical" class="ml-2 cursor-pointer text-gray-700">
          Typická západní dieta (žádné prodloužení)
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="feasible"
          inputId="feasible"
        />
        <label for="feasible" class="ml-2 cursor-pointer text-gray-700">
          Proveditelná dieta (u 20 let cca +6.2 let u žen a +7.3 let u mužů)
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="optimal"
          inputId="optimal"
        />
        <label for="optimal" class="ml-2 cursor-pointer text-gray-700">
          Optimalizovaná dieta (u 20 let cca +10.7 let u žen a +13.0 let u mužů)
        </label>
      </div>
    </div>

    <div class="mt-6 bg-gray-50 border border-gray-200 rounded p-4">
      <p class="text-lg text-gray-800">
        <span class="font-semibold">Odhadované prodloužení života:</span>
        +{{ dietStore.lifeGainYears.toFixed(2) }} let
      </p>
      <p class="text-sm text-gray-600 mt-2">
        (Výpočet vychází ze studie: "Estimating impact of food choices on life expectancy: A modeling study")
      </p>
    </div>
  </div>
</template>


<script setup lang="ts">
import RadioButton from 'primevue/radiobutton';
import { useDietStore } from '@/stores/lifeGainEatingStore';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

const dietStore = useDietStore();
const questionnaireStore = useQuestionnaireStore();
</script>

<style scoped>
</style>
