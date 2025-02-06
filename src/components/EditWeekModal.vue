<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="dialogHeader"
    :style="{ width: '40rem' }"
    class="p-4"
  >
    <p class="mb-4">
      <strong>Rozsah:</strong>
      {{ formatDate(week.startDate) }} – {{ formatDate(week.endDate) }}
    </p>
    <div v-if="isEditable">
      <div class="mb-4">
        <Textarea
          id="description"
          v-model="memo"
          rows="5"
          cols="30"
          class="w-full border border-gray-300 rounded p-2"
          style="resize: none"
        />
        <label for="description" class="block text-sm text-gray-600 mt-1">
          Poznámka
        </label>
      </div>

      <div class="flex flex-col gap-4 mt-4">
        <div class="flex items-center gap-2">
          <label class="w-40 text-gray-700">Spokojenost:</label>
          <Rating
            v-model="scoreSatisfaction"
            :cancel="false"
            v-tooltip.top="'Tooltip pro spokojenost'"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-40 text-gray-700">Emoční rovnováha:</label>
          <Rating
            v-model="scoreEmotionalBalance"
            :cancel="false"
            v-tooltip.top="'Tooltip pro emoční rovnováhu'"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-40 text-gray-700">Produktivita:</label>
          <Rating
            v-model="scoreProductivity"
            :cancel="false"
            v-tooltip.top="'Tooltip pro produktivitu'"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-40 text-gray-700">Vztahy:</label>
          <Rating
            v-model="scoreRelationships"
            :cancel="false"
            v-tooltip.top="'Tooltip pro vztahy'"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-40 text-gray-700">Soulad hodnot:</label>
          <Rating
            v-model="scoreValuesAlignment"
            :cancel="false"
            v-tooltip.top="'Tooltip pro souladu hodnot'"
          />
        </div>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <Button
          label="Uložit"
          @click="saveMemo"
          :disabled="loading"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        />
        <Button
          label="Zrušit"
          @click="closeDialog"
          :disabled="loading"
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        />
      </div>
      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    </div>
    <div v-else>
      <p class="mb-4">{{ week.additionalInfo || 'Poznámka není k dispozici.' }}</p>
      <div class="flex justify-end">
        <Button
          label="Zavřít"
          @click="closeDialog"
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { startOfISOWeek, addWeeks } from 'date-fns';
import { useLifeStore } from '@/stores/lifeStore';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Rating from 'primevue/rating';
import Textarea from 'primevue/textarea';


const props = defineProps<{
  week: {
    year: number;
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    isCurrentWeek: boolean;
    additionalInfo?: string;
    backendId?: number;
    score_satisfaction?: number;
    score_emotional_balance?: number;
    score_productivity?: number;
    score_relationships?: number;
    score_values_alignment?: number;
    total_score?: number | null;
  }
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const visible = ref(true);
watch(visible, (val) => {
  if (!val) {
    emit('close');
  }
});

const dialogHeader = computed(() => {
  return `Upravit poznámku pro týden ${props.week.weekNumber}, ${props.week.year}`;
});

const memo = ref(props.week.additionalInfo || '');
const scoreSatisfaction = ref(props.week.score_satisfaction ?? 1);
const scoreEmotionalBalance = ref(props.week.score_emotional_balance ?? 1);
const scoreProductivity = ref(props.week.score_productivity ?? 1);
const scoreRelationships = ref(props.week.score_relationships ?? 1);
const scoreValuesAlignment = ref(props.week.score_values_alignment ?? 1);

const loading = ref(false);
const error = ref('');

const lifeStore = useLifeStore();

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('cs-CZ');
};

const isEditable = computed(() => {
  const now = new Date();
  const startOfCurrentWeek = startOfISOWeek(now);
  const startOfPrevWeek = addWeeks(startOfCurrentWeek, -1);
  return !!props.week.backendId && (
    props.week.startDate.getTime() === startOfCurrentWeek.getTime() ||
    props.week.startDate.getTime() === startOfPrevWeek.getTime()
  );
});

const saveMemo = async () => {
  error.value = '';
  loading.value = true;
  try {
    await lifeStore.updateWeekMemo(
      props.week,
      memo.value,
      scoreSatisfaction.value,
      scoreEmotionalBalance.value,
      scoreProductivity.value,
      scoreRelationships.value,
      scoreValuesAlignment.value
    );
    closeDialog();
  } catch (e: any) {
    error.value = 'Chyba při ukládání poznámky.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  visible.value = false;
};
</script>
