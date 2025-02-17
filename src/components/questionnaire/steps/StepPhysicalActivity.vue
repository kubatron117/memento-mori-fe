<template>
  <div class="p-4 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">{{ t('app.steps.physical-activity.title') }}</h2>

    <p class="mb-4">{{ t('app.steps.physical-activity.exerciseType') }}</p>
    <div class="flex items-center space-x-4">
      <RadioButton
        v-model="activityStore.exerciseType"
        value="moderate"
        inputId="moderate"
      />
      <label for="moderate" class="cursor-pointer">
        {{ t('app.steps.physical-activity.moderateLabel') }}
      </label>
    </div>
    <div class="flex items-center space-x-4 mt-2">
      <RadioButton
        v-model="activityStore.exerciseType"
        value="vigorous"
        inputId="vigorous"
      />
      <label for="vigorous" class="cursor-pointer">
        {{ t('app.steps.physical-activity.vigorousLabel') }}
      </label>
    </div>

    <div class="mt-4">
      <label class="block mb-1 font-medium">
        {{ t('app.steps.physical-activity.exerciseMinutes') }}
      </label>
      <InputNumber
        v-model="activityStore.exerciseMinutes"
        :min="0"
        :max="10080"
        showButtons
        class="w-full"
      />
    </div>

    <div class="mt-6 p-4 bg-gray-50 rounded shadow">
      <p class="text-lg">
        <span class="font-semibold">{{ t('app.steps.physical-activity.lifeGainYears') }}:</span>
        +{{ activityStore.lifeGainYears.toFixed(2) }} let
      </p>
      <p class="text-sm text-gray-600 mt-1">
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
