<template>
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
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.smallBeer10') }}
          </label>
          <InputNumber v-model="alcoholStore.smallBeer10" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.largeBeer10') }}
          </label>
          <InputNumber v-model="alcoholStore.largeBeer10" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.smallBeer12') }}
          </label>
          <InputNumber v-model="alcoholStore.smallBeer12" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.largeBeer12') }}
          </label>
          <InputNumber v-model="alcoholStore.largeBeer12" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.shot') }}
          </label>
          <InputNumber v-model="alcoholStore.shot" :min="0" :max="200" showButtons class="w-full" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">
            {{ t('app.steps.alcohol.wine') }}
          </label>
          <InputNumber v-model="alcoholStore.wine" :min="0" :max="200" showButtons class="w-full" />
        </div>
      </div>

      <div class="mt-6 bg-gray-50 border border-gray-200 rounded p-4">
        <p class="text-lg text-gray-800">
          <span class="font-semibold">{{ t('app.steps.alcohol.totalAlcohol') }}: </span>
          {{ alcoholStore.totalAlcoholGrams.toFixed(1) }} g/týden
        </p>
        <p class="text-lg text-gray-800 mt-2">
          <span class="font-semibold">{{ t('app.steps.alcohol.lifeLost') }}: </span>
          <span v-if="alcoholStore.lifeLostYears === 0">
            {{ t('app.steps.alcohol.noLoss') }}
          </span>
          <span v-else>
            {{ alcoholStore.lifeLostYears }}
            {{ alcoholStore.lifeLostYears === 1 ? t('app.steps.alcohol.year') : t('app.steps.alcohol.years') }}
          </span>
        </p>
        <p class="text-sm text-gray-600 mt-1">{{ t('app.steps.alcohol.studyNote') }}</p>
      </div>
    </div>

    <div v-else-if="alcoholStore.drinksAlcohol === false" class="mt-6">
      <p class="text-gray-700">{{ t('app.steps.alcohol.noConsumption') }}</p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAlcoholStore } from '@/stores/lifeLossAlcoholStore'
import InputNumber from 'primevue/inputnumber'
import RadioButton from 'primevue/radiobutton'

const { t } = useI18n()
const alcoholStore = useAlcoholStore()
</script>

<style scoped>
</style>
