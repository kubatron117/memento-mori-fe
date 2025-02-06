<!-- src/components/LifeProgress.vue -->
<template>
  <div class="max-w-md mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Procent odžitého života</h2>
    <ProgressBar :value="percentage"></ProgressBar>

    <div class="mt-4 flex gap-2">
      <p>Odžito dní: <span class="font-semibold">{{ daysLived }}</span></p>
      <p>Zbývá dní: <span class="font-semibold">{{ daysRemaining }}</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { differenceInDays } from 'date-fns';
import { useLoginStore } from '@/stores/loginStore';
import ProgressBar from 'primevue/progressbar';

const loginStore = useLoginStore();

const birthDate = computed(() => loginStore.dateOfBirth ? new Date(loginStore.dateOfBirth) : null);
const deathDate = computed(() => loginStore.estimatedLifespan ? new Date(loginStore.estimatedLifespan) : null);
const today = new Date();

const totalDays = computed(() => {
  if (birthDate.value && deathDate.value) {
    return differenceInDays(deathDate.value, birthDate.value);
  }
  return 0;
});

const daysLived = computed(() => {
  if (birthDate.value) {
    return differenceInDays(today, birthDate.value);
  }
  return 0;
});

const daysRemaining = computed(() => {
  const remaining = totalDays.value - daysLived.value;
  return remaining > 0 ? remaining : 0;
});


const percentage = computed(() => {
  if (totalDays.value > 0) {
    let perc = (daysLived.value / totalDays.value) * 100;
    if (perc > 100) {
      perc = 100;
    }
    return Math.round(perc);
  }
  return 0;
});
</script>
