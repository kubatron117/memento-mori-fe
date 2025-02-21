<template>
  <InfoTextBox></InfoTextBox>

  <div class="bg-white shadow rounded p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      {{ t('app.steps.alcohol.title') }}
    </h2>

    <div class="mb-6">
      <label class="block text-gray-700 font-medium mb-2">
        {{ t('app.steps.alcohol.drinksAlcohol') }}
      </label>
      <div class="flex items-center space-x-6">
        <div class="flex items-center">
          <RadioButton v-model="alcoholStore.drinksAlcohol" :value="true" inputId="alkohol-ano" />
          <label for="alkohol-ano" class="ml-2 cursor-pointer text-gray-700">
            {{ t('app.steps.alcohol.yes') }}
          </label>
        </div>
        <div class="flex items-center">
          <RadioButton v-model="alcoholStore.drinksAlcohol" :value="false" inputId="alkohol-ne" />
          <label for="alkohol-ne" class="ml-2 cursor-pointer text-gray-700">
            {{ t('app.steps.alcohol.no') }}
          </label>
        </div>
      </div>
    </div>

    <div v-if="alcoholStore.drinksAlcohol === true">
      <p class="text-gray-600 mb-4">{{ t('app.steps.alcohol.instruction') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-gray-700 font-medium mb-1 flex items-center">
            {{ t('app.steps.alcohol.smallBeer10') }}
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.alcohol.tooltips.smallBeer10')"
            ></i>
          </label>
          <InputNumber v-model="alcoholStore.smallBeer10" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.largeBeer10') }}
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.alcohol.tooltips.largeBeer10')"
            ></i>
          </label>
          <InputNumber v-model="alcoholStore.largeBeer10" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.smallBeer12') }}
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.alcohol.tooltips.smallBeer12')"
            ></i>
          </label>
          <InputNumber v-model="alcoholStore.smallBeer12" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.largeBeer12') }}
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.alcohol.tooltips.largeBeer12')"
            ></i>
          </label>
          <InputNumber v-model="alcoholStore.largeBeer12" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.shot') }}
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.alcohol.tooltips.shot')"
            ></i>
          </label>
          <InputNumber v-model="alcoholStore.shot" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.wine') }}
            <i
              class="pi pi-info-circle ml-1 cursor-pointer"
              v-tooltip="t('app.steps.alcohol.tooltips.wine')"
            ></i>
          </label>
          <InputNumber v-model="alcoholStore.wine" :min="0" :max="200" showButtons class="w-full" />
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAlcoholStore } from '@/stores/lifeLossAlcoholStore'
import InputNumber from 'primevue/inputnumber'
import RadioButton from 'primevue/radiobutton'
import InfoTextBox from '@/components/InfoTextBox.vue'

const { t } = useI18n()
const alcoholStore = useAlcoholStore()
</script>

<style scoped>
</style>
