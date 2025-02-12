<template>
  <div>
    <h2>Finální krok: Zadejte věk</h2>
    <Slider
      v-model="desiredAge"
      :min="1"
      :max="140"
      inputId="desiredAge"
      class="w-full"
    />
    <p>Zvolený věk: {{ desiredAge }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import Slider from 'primevue/slider';

const store = useQuestionnaireStore();
const desiredAge = computed({
  get: () => store.desiredAge || 1,
  set: (val: number) => store.desiredAge = val,
});
</script>
