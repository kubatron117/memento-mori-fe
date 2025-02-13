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
  get: () => {
    if (store.desiredAge !== null && store.desiredAge !== undefined) {
      return store.desiredAge;
    }
    if (store.lifeExpectancy) {
      if (store.gender === 'male' && store.lifeExpectancy.male !== null) {
        return store.lifeExpectancy.male;
      }
      if (store.gender === 'female' && store.lifeExpectancy.female !== null) {
        return store.lifeExpectancy.female;
      }
      return store.lifeExpectancy.both || 1;
    }
    return 1;
  },
  set: (val: number) => {
    store.desiredAge = val;
  },
});
</script>
