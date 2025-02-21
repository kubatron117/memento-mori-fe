<template>
  <InfoTextBox></InfoTextBox>

  <div class="bg-white shadow rounded p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      {{ t('app.steps.physical-activity.title') }}
    </h2>

    <p class="text-gray-700 font-medium mb-4">
      {{ t('app.steps.physical-activity.exerciseType') }}
    </p>

    <div class="mt-4 p-4 border border-gray-200 rounded bg-gray-50">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">
        Definice intenzity cvičení
      </h3>
      <ul class="list-disc ml-6 text-gray-700">
        <li>
          <span class="font-bold">Mírná:</span>
          Aktivita o intenzitě 3–5,9 MET (např. Chůze rychlým tempem (4,8–6,5 km/h), pomalá jízda na kole (15 km/h), malování/dekorování, vysávání, zahradničení (sekání trávníku), golf (tažení holí ve vozíku), tenis (dvojice), společenský tanec a vodní aerobik.). Dýchání je zrychlené, ale umožňuje mluvit v celých větách.
        </li>
        <li>
          <span class="font-bold">Intenzivní:</span>
          Aktivita s hodnotou ≥6 MET (např. Závodní chůze, jogging nebo běh, jízda na kole rychlostí nad 15 km/h, náročné zahradničení (nepřetržité kopání nebo orání), plavání bazénem a tenis (singl)). Dýchání je velmi rychlé a mluvení je obtížné.
        </li>
      </ul>
    </div>

    <div class="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 mt-6">
      <div class="flex items-center">
        <RadioButton
          v-model="activityStore.exerciseType"
          value="none"
          inputId="none"
        />
        <label for="none" class="ml-2 cursor-pointer text-gray-700">
          {{ t('app.steps.physical-activity.noActivityLabel') }}
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="activityStore.exerciseType"
          value="moderate"
          inputId="moderate"
        />
        <label for="moderate" class="ml-2 cursor-pointer text-gray-700">
          {{ t('app.steps.physical-activity.moderateLabel') }}
          <span class="text-xs text-gray-500"> (např. rychlá chůze)</span>
        </label>
      </div>
      <div class="flex items-center">
        <RadioButton
          v-model="activityStore.exerciseType"
          value="vigorous"
          inputId="vigorous"
        />
        <label for="vigorous" class="ml-2 cursor-pointer text-gray-700">
          {{ t('app.steps.physical-activity.vigorousLabel') }}
          <span class="text-xs text-gray-500"> (např. běh)</span>
        </label>
      </div>
    </div>

    <div class="mt-6">
      <label class="block text-gray-700 font-medium mb-2">
        {{ t('app.steps.physical-activity.exerciseMinutes') }}
      </label>
      <InputNumber
        v-model="activityStore.exerciseMinutes"
        :min="0"
        :max="10080"
        showButtons
        class="w-full"
        :disabled="activityStore.exerciseType === 'none'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/stores/lifeGainActivityStore';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';
import InfoTextBox from '@/components/InfoTextBox.vue'

const { t } = useI18n();
const activityStore = useActivityStore();
</script>

<style scoped>
</style>
