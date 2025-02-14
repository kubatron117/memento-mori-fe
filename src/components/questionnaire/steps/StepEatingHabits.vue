<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Kalkulačka stravy a prodloužení života</h2>

    <p class="mt-4 mb-2 font-medium">Jakou stravu máte?</p>
    <div class="flex flex-col space-y-2">
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="typical"
          inputId="typical"
        />
        <label for="typical" class="cursor-pointer ml-2">
          Typická západní dieta (žádné prodloužení)
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="feasible"
          inputId="feasible"
        />
        <label for="feasible" class="cursor-pointer ml-2">
          Proveditelná dieta (u 20 let cca +6.2 let u žen a +7.3 let u mužů)
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="optimal"
          inputId="optimal"
        />
        <label for="optimal" class="cursor-pointer ml-2">
          Optimalizovaná dieta (u 20 let cca +10.7 let u žen a +13.0 let u mužů)
        </label>
      </div>
    </div>

    <div class="mt-6 p-4 bg-gray-50 rounded shadow">
      <p class="text-lg">
        <span class="font-semibold">Odhadované prodloužení života:</span>
        +{{ dietStore.lifeGainYears.toFixed(2) }} let
      </p>
      <p class="text-sm text-gray-600 mt-1">
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
