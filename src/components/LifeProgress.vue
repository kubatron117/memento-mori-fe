<template>
  <div class="max-w-full mx-auto p-4 flex flex-col md:flex-row gap-8 items-stretch">

    <div class="flex-1 border rounded-lg p-6 shadow-sm">
      <h4 class="text-2xl font-bold mb-4 text-center">Procent odžitého života</h4>
      <ProgressBar :value="percentage" class="w-full" style="height: 1rem;" />
      <div class="mt-4 flex justify-between text-base">
        <p>
          Odžito dní:
          <span class="font-semibold">{{ daysLived }}</span>
        </p>
        <p>
          Zbývá dní:
          <span class="font-semibold">{{ daysRemaining }}</span>
        </p>
      </div>
    </div>

    <div class="flex-1 border rounded-lg p-6 shadow-sm">
      <h4 class="text-2xl font-bold mb-4 text-center">Čas do očekávaného dožití</h4>
      <div v-if="estimatedDate" class="text-center text-base">
        <p class="text-lg">
          {{ countdown.days }} dní,
          {{ countdown.hours }} hodin,
          {{ countdown.minutes }} minut,
          {{ countdown.seconds }} sekund
        </p>
      </div>
      <div v-else class="text-center text-base">
        <p>Není nastaveno očekávané datum dožití.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { differenceInDays } from 'date-fns';
import { useLoginStore } from '@/stores/loginStore';
import ProgressBar from 'primevue/progressbar';
import { useCountdown } from '@/composables/useCountdown';

const loginStore = useLoginStore();

const birthDate = computed(() =>
  loginStore.dateOfBirth ? new Date(loginStore.dateOfBirth) : null
);
const deathDate = computed(() =>
  loginStore.estimatedLifespan ? new Date(loginStore.estimatedLifespan) : null
);
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
    return Math.round(perc > 100 ? 100 : perc);
  }
  return 0;
});

const estimatedDate = deathDate.value;
const countdown = useCountdown(estimatedDate);
</script>
