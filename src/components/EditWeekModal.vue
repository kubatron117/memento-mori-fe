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
        <label for="description" class="block text-sm text-gray-600 mt-1">
          Poznámka <span class="text-red-500">*</span>
        </label>
        <Textarea
          id="description"
          v-model="memo"
          rows="5"
          cols="30"
          maxlength="2000"
          class="w-full border border-gray-300 rounded p-2"
          style="resize: none"
          required
        />

        <div class="text-right text-sm text-gray-500 mt-1">
          {{ memo.length }}/2000
        </div>
      </div>

      <div class="flex flex-col gap-4 mt-4">
        <div
          v-for="field in ratingFields"
          :key="field.key"
          class="flex items-center gap-2"
        >
          <label class="w-40 text-gray-700">
            {{ field.label }} <span class="text-red-500">*</span>:
          </label>
          <Rating
            v-model="field.model"
            :cancel="false"
            v-tooltip.top="field.tooltip"
          />
        </div>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <Button
          label="Uložit"
          @click="saveMemo"
          :disabled="loading || !isFormValid"
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
      <p class="mb-4">
        {{ week.additionalInfo || 'Poznámka není k dispozici.' }}
      </p>

      <div
        v-if="week.total_score !== null && week.total_score !== undefined"
        class="flex flex-col gap-2 mb-4"
      >
        <div
          v-for="field in ratingFields"
          :key="field.key"
          class="flex items-center gap-2"
        >
          <label class="w-40 text-gray-700">{{ field.label }}:</label>
          <Rating :model-value="(week as any)[field.key]" readonly :cancel="false" />
        </div>

        <div class="flex items-center gap-2">
          <label class="w-40 text-gray-700">Celkové skóre:</label>
          <Rating :model-value="week.total_score" readonly :cancel="false" />
        </div>
      </div>

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
import { startOfISOWeek, addWeeks, isSameDay } from 'date-fns';
import { useLifeStore } from '@/stores/lifeStore';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Rating from 'primevue/rating';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;

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
const scoreSatisfaction = ref<number>(props.week.score_satisfaction ?? 0);
const scoreEmotionalBalance = ref<number>(props.week.score_emotional_balance ?? 0);
const scoreProductivity = ref<number>(props.week.score_productivity ?? 0);
const scoreRelationships = ref<number>(props.week.score_relationships ?? 0);
const scoreValuesAlignment = ref<number>(props.week.score_values_alignment ?? 0);

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
    isSameDay(props.week.startDate, startOfCurrentWeek) ||
    isSameDay(props.week.startDate, startOfPrevWeek)
  );
});

const isFormValid = computed(() => {
  return memo.value.trim() !== '' &&
    scoreSatisfaction.value > 0 &&
    scoreEmotionalBalance.value > 0 &&
    scoreProductivity.value > 0 &&
    scoreRelationships.value > 0 &&
    scoreValuesAlignment.value > 0;
});

const ratingFields = [
  {
    label: 'Spokojenost',
    key: 'score_satisfaction',
    tooltip: 'Hodnocení Vaší spokojenosti během týdne',
    model: scoreSatisfaction
  },
  {
    label: 'Emoční rovnováha',
    key: 'score_emotional_balance',
    tooltip: 'Hodnocení Vaší emoční rovnováhy během týdne',
    model: scoreEmotionalBalance
  },
  {
    label: 'Produktivita',
    key: 'score_productivity',
    tooltip: 'Hodnocení Vaší produktivity během týdne',
    model: scoreProductivity
  },
  {
    label: 'Vztahy',
    key: 'score_relationships',
    tooltip: 'Hodnocení spokojenosti ve Vaších vztazích během týdne',
    model: scoreRelationships
  },
  {
    label: 'Soulad hodnot',
    key: 'score_values_alignment',
    tooltip: 'Hodnocení zda jste jednali v souladu s Vašimi hodnotami během týdne',
    model: scoreValuesAlignment
  }
];

const saveMemo = async () => {
  error.value = '';

  if (!isFormValid.value) {
    error.value = 'Vyplňte prosím všechny povinné položky.';
    return;
  }

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
    toast.add({
      severity: 'success',
      summary: 'Úspěšně uloženo',
      detail: 'Hodnocení vašeho týdne bylo úspěšně uloženo.',
      life: TOAST_DURATION_IN_MS
    });
    closeDialog();
  } catch (e: any) {
    error.value = 'Chyba při ukládání poznámky.';
    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: 'Vyskytla se chyba. Nepodařilo se uložit hodnocení Vašeho týdne.',
      life: TOAST_DURATION_IN_MS
    });
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  visible.value = false;
};
</script>

