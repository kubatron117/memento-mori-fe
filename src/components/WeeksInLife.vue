<template>
  <div class="p-5">
    <div class="flex flex-col lg:flex-row items-center justify-center lg:justify-between">
      <div class="mb-5 flex items-center gap-3 justify-end">
        <label for="circleSizeSlider" class="font-medium text-black">
          {{ t('app.weeks.weekSize') }}
        </label>
        <input
          id="circleSizeSlider"
          type="range"
          class="w-56 h-2 bg-gray-100 appearance-none cursor-pointer rounded-md"
          v-model.lazy="circleSize"
          :min="10"
          :max="30"
        />
      </div>

      <div class="mb-5 flex items-center gap-2 justify-end">
        <Checkbox
          binary
          v-model="scoreVisualizationEnabled"
          inputId="scoreVisualizationCheckbox"
        />
        <label for="scoreVisualizationCheckbox" class="cursor-pointer font-medium">
          {{ t('app.weeks.scoreVisualization') }}
        </label>
      </div>

      <div class="mb-5 flex items-center gap-3 justify-end">
<!--        <label for="visualizationSelect" class="font-medium">-->
<!--          {{ t('app.visualization.label') }}-->
<!--        </label>-->
        <Select
          class="w-56"
          id="visualizationSelect"
          v-model="selectedVisualization"
          :options="visualizationOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select visualization"
        />
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
      />
    </div>

    <div v-else-if="weeks.length === 0" class="text-center text-gray-500">
      {{ t('app.weeks.noData') }}
    </div>

    <div v-else>
      <template v-if="selectedVisualization === 'year'">
        <div class="mb-6">
          <div class="mb-2 font-bold">{{ groupedData[0].label }}</div>
          <div class="flex flex-wrap gap-2">
            <template v-for="group in groupedData[0].groups" :key="group.key">
              <div
                class="group rounded-full relative flex items-center justify-center transition-transform hover:scale-110"
                :class="getGroupClass(group)"
                :style="{ width: circleSize + 'px', height: circleSize + 'px' }"
                v-tooltip="getYearTooltip(group)"
              >
              </div>
            </template>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="decade in groupedData" :key="decade.key" class="mb-6">
          <div class="mb-2 font-bold">{{ decade.label }}</div>
          <div class="flex flex-wrap gap-2">
            <template v-for="group in decade.groups" :key="group.key">
              <template v-if="selectedVisualization === 'week'">
                <div
                  class="group rounded-full cursor-pointer relative flex items-center justify-center transition-transform hover:scale-110"
                  :class="getWeekClass(group.weeks[0])"
                  :style="{ width: circleSize + 'px', height: circleSize + 'px' }"
                  @click="selectWeek(group.weeks[0])"
                  v-tooltip="getWeekTooltip(group.weeks[0])"
                >
                </div>
              </template>

              <template v-else-if="selectedVisualization === 'month'">
                <div
                  class="group rounded-full relative flex items-center justify-center transition-transform hover:scale-110"
                  :class="getGroupClass(group)"
                  :style="{ width: circleSize + 'px', height: circleSize + 'px' }"
                  v-tooltip="getMonthTooltip(group)"
                >
                </div>
              </template>
            </template>
          </div>
        </div>
      </template>
    </div>

    <EditWeekModal
      v-if="selectedWeek && selectedVisualization === 'week'"
      :week="selectedWeek"
      @close="closeModal"
    />

    <div class="mt-4">
      <Button label="Export do PDF 50x70 (cm)" @click="exportPdf" class="!bg-primary-800 text-white hover:!bg-primary-600" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLifeStore } from '@/stores/lifeStore';
import EditWeekModal from '@/components/EditWeekModal.vue';
import ProgressSpinner from 'primevue/progressspinner';
import Checkbox from 'primevue/checkbox';
import Select from 'primevue/select';
import Button from 'primevue/button';
import { groupWeeks } from '@/utils/monthGroupingUtils';
import type { DecadeGroup, Week } from '@/utils/monthGroupingUtils';
import { getWeekBgClass, getGroupBgClass } from '@/utils/bgClassUtils';
import { generateMementoMoriPdf } from '@/utils/pdfExportUtils';

const { t } = useI18n();
const lifeStore = useLifeStore();

const weeks = computed<Week[]>(() => lifeStore.weeks);
const selectedWeek = ref<Week | null>(null);
const circleSize = ref(20);
const scoreVisualizationEnabled = ref(false);

const isLoading = ref(true);
watch(weeks, (newWeeks) => {
  isLoading.value = false;
}, { immediate: true });

const formatDate = (date: Date): string => date.toLocaleDateString('cs-CZ');

const selectWeek = (week: Week) => {
  if (selectedVisualization.value === 'week') {
    selectedWeek.value = week;
  }
};
const closeModal = () => {
  selectedWeek.value = null;
};

const visualizationOptions = ref([
  { label: t('app.visualization.week'), value: 'week' },
  { label: t('app.visualization.month'), value: 'month' },
  { label: t('app.visualization.year'), value: 'year' },
]);
const selectedVisualization = ref<'week' | 'month' | 'year'>('week');

watch(selectedVisualization, async () => {
  isLoading.value = true;
  await nextTick();
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
});

const groupedData = computed<DecadeGroup[]>(() =>
  groupWeeks(weeks.value, selectedVisualization.value)
);

const getWeekClass = (week: Week) => getWeekBgClass(week, scoreVisualizationEnabled.value);
const getGroupClass = (group: any) => getGroupBgClass(group, scoreVisualizationEnabled.value);

function exportPdf() {
  generateMementoMoriPdf(groupedData.value, scoreVisualizationEnabled.value, selectedVisualization.value);
}

const getYearTooltip = (group: any): string => {
  let tooltip = `${group.label}`;
  if (scoreVisualizationEnabled.value && group.aggregatedScore !== null) {
    tooltip += `\n${t('app.weeks.totalScore')} ${group.aggregatedScore.toFixed(1)}`;
  }
  return tooltip;
};

const getMonthTooltip = (group: any): string => {
  let tooltip = `${group.label}`;
  if (scoreVisualizationEnabled.value && group.aggregatedScore !== null) {
    tooltip += `\n${t('app.weeks.totalScore')} ${group.aggregatedScore.toFixed(1)}`;
  }
  return tooltip;
};

const getWeekTooltip = (week: Week): string => {
  let tooltip = `${t('app.weeks.year')} ${week.year}\n${t('app.weeks.week')} ${week.weekNumber}\n${t('app.weeks.range')} ${formatDate(week.startDate)} – ${formatDate(week.endDate)}`;
  if (week.additionalInfo) {
    tooltip += `\n${t('app.weeks.info')} ${week.additionalInfo.substring(0, 30)}`;
  }
  if (scoreVisualizationEnabled.value && week.total_score !== null && week.total_score !== undefined) {
    tooltip += `\n${t('app.weeks.totalScore')} ${week.total_score}`;
  }
  return tooltip;
};
</script>

<style scoped>
#circleSizeSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 1rem;
  width: 1rem;
  background: black;
  border-radius: 50%;
  cursor: pointer;
}

#circleSizeSlider::-moz-range-thumb {
  height: 1rem;
  width: 1rem;
  background: black;
  border-radius: 50%;
  cursor: pointer;
}

#circleSizeSlider::-ms-thumb {
  height: 1rem;
  width: 1rem;
  background: black;
  border-radius: 50%;
  cursor: pointer;
}
</style>
