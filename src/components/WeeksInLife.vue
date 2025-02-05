<!-- src/components/WeeksInLife.vue -->
<template>
  <div class="life-weeks-container">
    <div v-if="weeks.length === 0" class="no-data">
      Nebyla nalezena data o týdnech.
    </div>
    <div v-else class="grid">
      <div
        v-for="week in weeks"
        :key="`${week.year}-${week.weekNumber}`"
        class="week-cell"
        :class="{ current: week.isCurrentWeek }"
      >
        <span class="week-number">{{ week.weekNumber }}</span>

        <div class="tooltip">
          <p><strong>Rok:</strong> {{ week.year }}</p>
          <p><strong>Týden:</strong> {{ week.weekNumber }}</p>
          <p>
            <strong>Rozsah:</strong>
            {{ formatDate(week.startDate) }} -
            {{ formatDate(week.endDate) }}
          </p>
          <p v-if="week.additionalInfo">
            <strong>Info:</strong> {{ week.additionalInfo }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useLifeStore } from '@/stores/lifeStore';

const lifeStore = useLifeStore();
const weeks = computed(() => lifeStore.weeks);

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('cs-CZ');
};
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
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 2px;
}

.week-cell {
  width: 40px;
  height: 40px;
  background-color: #4caf50;
  border: 1px solid #fff;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible; /* Umožňuje tooltip, aby přesahoval buňku */
  transition: background-color 0.3s, transform 0.3s;
}

.week-cell.current {
  background-color: #ff9800;
  border: 2px solid #ff5722;
  transform: scale(1.1);
}

.week-cell:hover {
  background-color: #45a049;
}

.week-number {
  z-index: 1;
}

.tooltip {
  visibility: hidden;
  width: 200px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: left;
  border-radius: 4px;
  padding: 10px;
  position: absolute;
  z-index: 10;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
}

.week-cell:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
