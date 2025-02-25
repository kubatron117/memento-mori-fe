<script lang="ts" setup>
import { defineAsyncComponent, onMounted } from 'vue'
import { useLifeStore } from '@/stores/lifeStore';
import { useLoginStore } from '@/stores/loginStore';

const lifeStore = useLifeStore();
const loginStore = useLoginStore();

const Navbar = defineAsyncComponent(() => import('@/components/Navbar.vue'));
const LifeProgress = defineAsyncComponent(() => import('@/components/LifeProgress.vue'));
const WeeksInLife = defineAsyncComponent(() => import('@/components/WeeksInLife.vue'));

onMounted(async () => {
  if (loginStore.dateOfBirth && loginStore.estimatedLifespan) {
    await lifeStore.loadWeeks();
  } else {
    console.error(
      'Není nastaveno datum narození nebo očekávané datum úmrtí v loginStore.'
    );
  }
});
</script>


<template>
  <div class="life-calculator">
    <Navbar />
    <LifeProgress />
    <WeeksInLife />
  </div>
</template>

<style scoped>
.life-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
