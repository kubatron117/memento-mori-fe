<template>
  <div class="bg-white shadow rounded p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      {{ t('app.steps.physical-activity.title') }}
    </h2>

    <p class="text-gray-700 font-medium mb-4">
      {{ t('app.steps.physical-activity.exerciseType') }}
    </p>

    <div class="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
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

    <div class="mt-6 bg-gray-50 border border-gray-200 rounded p-4">
      <p class="text-lg text-gray-800">
        <span class="font-semibold">{{ t('app.steps.physical-activity.lifeGainYears') }}: </span>
        +{{ activityStore.lifeGainYears.toFixed(2) }} let
      </p>
      <p class="text-sm text-gray-600 mt-2">
        {{ t('app.steps.physical-activity.studyNote') }}
      </p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useActivityStore } from '@/stores/lifeGainActivityStore';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';

const { t } = useI18n();
const activityStore = useActivityStore();
</script>

<style scoped>
</style>
