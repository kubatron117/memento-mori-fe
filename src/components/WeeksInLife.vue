<template>
  <div class="life-weeks-container">
    <div v-if="weeks.length === 0" class="no-data">
      Prosím, zadejte datum narození a očekávané datum úmrtí.
    </div>
    <div v-else class="grid">
      <div
        v-for="week in weeks"
        :key="week"
        class="week-cell"
        :title="`Týden ${week}`"
      >
        {{ week }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useLifeStore } from '../stores/lifeStore';

// Použití Pinia storeu
const lifeStore = useLifeStore();

// Vypočítat počet týdnů
const weeks = computed(() => {
  if (!lifeStore.dateOfBirth || !lifeStore.expectedDeathDate) {
    return [];
  }

  const oneWeekInMs = 1000 * 60 * 60 * 24 * 7;
  const diffInMs = lifeStore.expectedDeathDate.getTime() - lifeStore.dateOfBirth.getTime();

  if (diffInMs < 0) {
    return [];
  }

  const totalWeeks = Math.floor(diffInMs / oneWeekInMs);
  return Array.from({ length: totalWeeks }, (_, i) => i + 1);
});
</script>

<style scoped>
.life-weeks-container {
  padding: 20px;
}

.no-data {
  text-align: center;
  color: #888;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20px, 1fr));
  gap: 2px;
}

.week-cell {
  width: 20px;
  height: 20px;
  background-color: #4caf50;
  border: 1px solid #fff;
  box-sizing: border-box;
  cursor: pointer;
}

.week-cell:hover {
  background-color: #45a049;
}
</style>
