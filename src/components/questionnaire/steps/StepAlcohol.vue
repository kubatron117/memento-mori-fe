<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">{{ t('app.steps.alcohol.title') }}</h2>
    <div class="mb-4">
      <label class="block mb-1 font-medium">{{ t('app.steps.alcohol.drinksAlcohol') }}</label>
      <div class="flex items-center space-x-4">
        <RadioButton v-model="alcoholStore.drinksAlcohol" :value="true" inputId="alkohol-ano" />
        <label for="alkohol-ano" class="cursor-pointer">{{ t('app.steps.alcohol.yes') }}</label>
        <RadioButton v-model="alcoholStore.drinksAlcohol" :value="false" inputId="alkohol-ne" />
        <label for="alkohol-ne" class="cursor-pointer">{{ t('app.steps.alcohol.no') }}</label>
      </div>
    </div>
    <div v-if="alcoholStore.drinksAlcohol === true">
      <p class="mb-4">{{ t('app.steps.alcohol.instruction') }}</p>
      <div class="mb-4">
        <label class="block mb-1 font-medium">{{ t('app.steps.alcohol.smallBeer10') }}</label>
        <InputNumber v-model="alcoholStore.smallBeer10" :min="0" :max="200" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">{{ t('app.steps.alcohol.largeBeer10') }}</label>
        <InputNumber v-model="alcoholStore.largeBeer10" :min="0" :max="200" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">{{ t('app.steps.alcohol.smallBeer12') }}</label>
        <InputNumber v-model="alcoholStore.smallBeer12" :min="0" :max="200" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">{{ t('app.steps.alcohol.largeBeer12') }}</label>
        <InputNumber v-model="alcoholStore.largeBeer12" :min="0" :max="200" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">{{ t('app.steps.alcohol.shot') }}</label>
        <InputNumber v-model="alcoholStore.shot" :min="0" :max="200" showButtons class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1 font-medium">{{ t('app.steps.alcohol.wine') }}</label>
        <InputNumber v-model="alcoholStore.wine" :min="0" :max="200" showButtons class="w-full" />
      </div>
      <div class="mt-6 p-4 bg-gray-50 rounded shadow">
        <p class="text-lg">
          <span class="font-semibold">{{ t('app.steps.alcohol.totalAlcohol') }}</span>
          {{ alcoholStore.totalAlcoholGrams.toFixed(1) }} g/týden
        </p>
        <p class="text-lg mt-2">
          <span class="font-semibold">{{ t('app.steps.alcohol.lifeLost') }}</span>
          <template v-if="alcoholStore.lifeLostYears === 0">
            {{ t('app.steps.alcohol.noLoss') }}
          </template>
          <template v-else>
            {{ alcoholStore.lifeLostYears }} {{ alcoholStore.lifeLostYears === 1 ? t('app.steps.alcohol.year') : t('app.steps.alcohol.years') }}
          </template>
        </p>
        <p class="text-sm text-gray-600 mt-1">
          {{ t('app.steps.alcohol.studyNote') }}
        </p>
      </div>
    </div>
    <div v-else-if="alcoholStore.drinksAlcohol === false" class="mt-6">
      <p>{{ t('app.steps.alcohol.noConsumption') }}</p>
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
