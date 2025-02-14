<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Kalkulačka fyzické aktivity a prodloužení života</h2>

    <p class="mb-4">Vyberte typ cvičení:</p>
    <div class="flex items-center space-x-4">
      <RadioButton
        v-model="activityStore.exerciseType"
        value="moderate"
        inputId="moderate"
      />
      <label for="moderate" class="cursor-pointer">
        Mírná (doporučeno 150 minut týdně)
      </label>
    </div>
    <div class="flex items-center space-x-4 mt-2">
      <RadioButton
        v-model="activityStore.exerciseType"
        value="vigorous"
        inputId="vigorous"
      />
      <label for="vigorous" class="cursor-pointer">
        Intenzivní (doporučeno 75 minut týdně)
      </label>
    </div>

    <div class="mt-4">
      <label class="block mb-1 font-medium">
        Počet minut cvičení za týden
      </label>
      <InputNumber
        v-model="activityStore.exerciseMinutes"
        :min="0"
        showButtons
        class="w-full"
      />
    </div>

    <div class="mt-6 p-4 bg-gray-50 rounded shadow">
      <p class="text-lg">
        <span class="font-semibold">Odhadované prodloužení života:</span>
        +{{ activityStore.lifeGainYears.toFixed(2) }} let
      </p>
      <p class="text-sm text-gray-600 mt-1">
        (Na základě studie: dosažení doporučené úrovně fyzické aktivity může prodloužit život přibližně o 5 let.)
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useActivityStore } from '@/stores/lifeGainActivityStore';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';

const activityStore = useActivityStore();
</script>

<style scoped>
/* případné lokální styly */
</style>
