<template>
  <InfoTextBox></InfoTextBox>
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
          Typická západní dieta
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="feasible"
          inputId="feasible"
        />
        <label for="feasible" class="ml-2 cursor-pointer text-gray-700">
          Proveditelná dieta
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="questionnaireStore.eatingHabits"
          value="optimal"
          inputId="optimal"
        />
        <label for="optimal" class="ml-2 cursor-pointer text-gray-700">
          Optimalizovaná dieta
        </label>
      </div>
    </div>

    <div v-if="(questionnaireStore.eatingHabits !== 'typical' && questionnaireStore.eatingHabits !== null) && currentAge > 20" class="mt-6">
      <p class="text-gray-700 font-medium mb-2">
        Od jakého věku tuto dietu používáte?
      </p>
      <input
        type="number"
        v-model.number="questionnaireStore.dietStartAge"
        :min="20"
        :max="currentAge"
        class="border rounded p-2 w-full"
      />
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

    <div class="mt-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">
        Srovnání doporučených denních příjmů (g/den)
      </h3>
      <table class="w-full border-collapse text-left text-sm text-gray-700">
        <thead>
        <tr class="bg-gray-100 border-b">
          <th class="p-2 font-semibold text-gray-800">Potravina</th>
          <th class="p-2 font-semibold text-gray-800">Typická</th>
          <th class="p-2 font-semibold text-gray-800">Proveditelná</th>
          <th class="p-2 font-semibold text-gray-800">Optimalizovaná</th>
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import RadioButton from 'primevue/radiobutton';
import { useDietStore } from '@/stores/lifeGainEatingStore';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import InfoTextBox from '@/components/InfoTextBox.vue'

const dietStore = useDietStore();
const questionnaireStore = useQuestionnaireStore();

const currentAge = computed(() => questionnaireStore.getCurrentAge());

const dietComparison = [
  { food: 'Obiloviny celozrnné', typical: 50, feasible: 137.5, optimal: 225 },
  { food: 'Zelenina', typical: 250, feasible: 325, optimal: 400 },
  { food: 'Ovoce', typical: 200, feasible: 300, optimal: 400 },
  { food: 'Ořechy', typical: 0, feasible: 12.5, optimal: 25 },
  { food: 'Luštěniny', typical: 0, feasible: 100, optimal: 200 },
  { food: 'Ryby', typical: 50, feasible: 125, optimal: 200 },
  { food: 'Vejce', typical: 50, feasible: 37.5, optimal: 25 },
  { food: 'Mléko/mléčné výrobky', typical: 300, feasible: 250, optimal: 200 },
  { food: 'Rafinované obiloviny', typical: 150, feasible: 100, optimal: 50 },
  { food: 'Červené maso', typical: 100, feasible: 50, optimal: 0 },
  { food: 'Zpracované maso', typical: 50, feasible: 25, optimal: 0 },
  { food: 'Bílé maso', typical: 75, feasible: 62.5, optimal: 50 },
  { food: 'Slazené nápoje', typical: 500, feasible: 250, optimal: 0 },
  { food: 'Přidané rostlinné oleje', typical: 25, feasible: 25, optimal: 25 },
];
</script>

<style scoped>
</style>
