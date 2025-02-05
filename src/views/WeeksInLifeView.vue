<!-- src/views/LifeCalculator.vue -->
<template>
  <div class="life-calculator">
    <Navbar />
    <h1>Kalkulačka životních týdnů</h1>
    <WeeksInLife />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useLifeStore } from '@/stores/lifeStore';
import { useLoginStore } from '@/stores/loginStore';
import WeeksInLife from '@/components/WeeksInLife.vue';
import Navbar from '@/components/Navbar.vue';

const lifeStore = useLifeStore();
const loginStore = useLoginStore();

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

<style scoped>
.life-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
