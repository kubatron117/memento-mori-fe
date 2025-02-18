<template>
  <div class="p-5">

    <div class="mb-5 flex items-center gap-3 justify-end">
      <label for="circleSizeSlider" class="font-medium">
        {{ t('app.weeks.weekSize') }}
      </label>
      <Slider
        class="w-56"
        id="circleSizeSlider"
        v-model="circleSize"
        :min="10"
        :max="30"
      />
    </div>

    <div class="mb-5 flex items-center gap-2 justify-end">
      <Checkbox
        binary
        v-model="scoreVisualizationEnabled"
        inputId="scoreVisualizationCheckbox"
        @change="onCheckboxChange"
      />
      <label for="scoreVisualizationCheckbox" class="cursor-pointer font-medium">
        {{ t('app.weeks.scoreVisualization') }}
      </label>
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
      <div v-for="group in groupedWeeks" :key="group.label" class="mb-6">
        <div class="mb-2 font-bold">{{ group.label }}</div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="week in group.weeks"
            :key="`${week.year}-${week.weekNumber}`"
            class="group rounded-full cursor-pointer relative flex items-center justify-center transition-transform hover:scale-110"
            :class="getWeekBgClass(week)"
            :style="{ width: circleSize + 'px', height: circleSize + 'px' }"
            @click="selectWeek(week)"
          >
            <div
              class="invisible absolute z-10 w-48 bg-black bg-opacity-80 text-white text-left rounded p-2 bottom-full left-1/2 transform -translate-x-1/2 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:visible group-hover:opacity-100"
            >
              <p><strong>{{ t('app.weeks.year') }}</strong> {{ week.year }}</p>
              <p><strong>{{ t('app.weeks.week') }}</strong> {{ week.weekNumber }}</p>
              <p>
                <strong>{{ t('app.weeks.range') }}</strong>
                {{ formatDate(week.startDate) }} – {{ formatDate(week.endDate) }}
              </p>
              <p v-if="week.additionalInfo">
                <strong>{{ t('app.weeks.info') }}</strong> {{ week.additionalInfo }}
              </p>
              <p v-if="scoreVisualizationEnabled && week.total_score !== null && week.total_score !== undefined">
                <strong>{{ t('app.weeks.totalScore') }}</strong> {{ week.total_score }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditWeekModal v-if="selectedWeek" :week="selectedWeek" @close="closeModal" class="motion-preset-expand " />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLifeStore } from '@/stores/lifeStore';
import EditWeekModal from '@/components/EditWeekModal.vue';
import Slider from 'primevue/slider';
import ProgressSpinner from 'primevue/progressspinner';
import Checkbox from 'primevue/checkbox';

const { t } = useI18n();

const lifeStore = useLifeStore();
const weeks = computed(() => lifeStore.weeks);
const selectedWeek = ref<null | typeof weeks.value[number]>(null);

const circleSize = ref<number>(20);
const scoreVisualizationEnabled = ref<boolean>(false);

const isLoading = ref(true);
watch(weeks, (newWeeks) => {
  if (newWeeks.length > 0) {
    isLoading.value = false;
  }
});

watch(scoreVisualizationEnabled, (newVal) => {
  console.log('scoreVisualizationEnabled změněno na:', newVal);
});

const onCheckboxChange = () => {
  console.log('Checkbox změnil hodnotu na:', scoreVisualizationEnabled.value);
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('cs-CZ');
};

const selectWeek = (week: typeof weeks.value[number]) => {
  selectedWeek.value = week;
};

const closeModal = () => {
  selectedWeek.value = null;
};

const isWeekPassed = (week: typeof weeks.value[number]): boolean => {
  return week.endDate.getTime() < Date.now();
};

const getWeekBgClass = (week: typeof weeks.value[number]) => {
  if (!scoreVisualizationEnabled.value) {
    return week.isCurrentWeek ? 'bg-orange-500' : (isWeekPassed(week) ? 'bg-black' : 'bg-gray-300');
  } else {
    if (!week.isCurrentWeek && !isWeekPassed(week)) {
      return 'bg-gray-300';
    }
    if (week.total_score === null || week.total_score === undefined) {
      return 'bg-black';
    }
    if (week.total_score < 12) {
      return 'bg-red-500';
    } else if (week.total_score < 19) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  }
};

const groupedWeeks = computed(() => {
  const groupsMap = new Map<number, typeof weeks.value[number][]>();
  weeks.value.forEach(week => {
    const decade = Math.floor(week.year / 10) * 10;
    if (!groupsMap.has(decade)) {
      groupsMap.set(decade, []);
    }
    groupsMap.get(decade)!.push(week);
  });
  const groups = [];
  const sortedDecades = Array.from(groupsMap.keys()).sort((a, b) => a - b);
  sortedDecades.forEach(decade => {
    groups.push({
      label: `${decade} – ${decade + 9}`,
      weeks: groupsMap.get(decade) || [],
    });
  });
  return groups;
});
</script>
