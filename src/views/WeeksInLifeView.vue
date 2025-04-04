<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useLifeStore } from '@/stores/lifeStore';
import { useLoginStore } from '@/stores/loginStore';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n'

const ProgressSpinner = defineAsyncComponent(() => import('primevue/progressspinner'));

const { t } = useI18n();

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;
const isLoading = ref(true);

const lifeStore = useLifeStore();
const loginStore = useLoginStore();

const Navbar = defineAsyncComponent(() => import('@/components/Navbar.vue'));
const LifeProgress = defineAsyncComponent(() => import('@/components/LifeProgress.vue'));
const WeeksInLife = defineAsyncComponent(() => import('@/components/WeeksInLife.vue'));

onMounted(async () => {
  if (loginStore.dateOfBirth && loginStore.estimatedLifespan) {
    await lifeStore.loadWeeks();
  } else {
    toast.add({
      severity: 'error',
      summary: t('app.weeksInLife.toast.error'),
      detail: t('app.weeksInLife.toast.detail'),
      life: TOAST_DURATION_IN_MS
    });
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="life-calculator">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>
    <div v-else>
      <Navbar />
      <LifeProgress />
      <WeeksInLife />
    </div>
  </div>
</template>

<style scoped>
.life-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
