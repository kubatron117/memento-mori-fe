<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black opacity-50"></div>
    <!-- Modal -->
    <div class="bg-white p-6 rounded shadow-lg relative w-full max-w-2xl mx-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">{{ dialogHeader }}</h3>
        <button @click="closeDialog" class="text-gray-700 text-2xl leading-none">&times;</button>
      </div>

      <!-- Date Range -->
      <p class="mb-4">
        <strong>Rozsah:</strong>
        {{ formattedStartDate }} – {{ formattedEndDate }}
      </p>

      <!-- Editable Form -->
      <div v-if="isEditable">
        <div class="mb-4">
          <label for="description" class="block text-sm text-gray-600 mt-1">
            Poznámka <span class="text-red-500">*</span>
          </label>
          <!-- Wrapper pro optimalizaci textarey pro Safari -->
          <div class="relative" style="min-height: 7rem;">
            <textarea
              id="description"
              v-model="memo"
              rows="5"
              maxlength="2000"
              class="w-full h-full border border-gray-300 rounded p-2 absolute top-0 left-0"
              style="resize: none"
              required
            ></textarea>
          </div>
          <div class="text-right text-sm text-gray-500 mt-1">
            {{ memo.length }}/2000
          </div>
        </div>

        <!-- Rating Fields -->
        <div class="flex flex-col gap-4 mt-4">
          <div
            v-for="field in ratingFields"
            :key="field.key"
            class="flex items-center gap-2"
          >
            <label class="w-40 text-gray-700">
              {{ field.label }} <span class="text-red-500">*</span>:
            </label>
            <input
              type="number"
              v-model.number="field.model"
              min="1"
              max="5"
              class="w-20 border border-gray-300 rounded p-1 text-center"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 mt-6">
          <button
            @click="saveMemo"
            :disabled="loading || !isFormValid"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Uložit
          </button>
          <button
            @click="closeDialog"
            :disabled="loading"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Zrušit
          </button>
        </div>
        <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      </div>

      <!-- Read-Only View -->
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
            <span class="font-semibold">{{ week[field.key] }}</span>
          </div>
          <div class="flex items-center gap-2">
            <label class="w-40 text-gray-700">Celkové skóre:</label>
            <span class="font-semibold">{{ week.total_score }}</span>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            @click="closeDialog"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Zavřít
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { startOfISOWeek, addWeeks, isSameDay } from 'date-fns';
import { useLifeStore } from '@/stores/lifeStore';

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

// Stav modálního okna
const visible = ref(true);
watch(visible, (val) => {
  if (!val) {
    emit('close');
  }
});

// Hlavička dialogu
const dialogHeader = computed(() => {
  return `Upravit poznámku pro týden ${props.week.weekNumber}, ${props.week.year}`;
});

// Formátovaná data
const formattedStartDate = ref('');
const formattedEndDate = ref('');
onMounted(() => {
  formattedStartDate.value = formatDate(props.week.startDate);
  formattedEndDate.value = formatDate(props.week.endDate);
});

// Proměnné formuláře
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
    scoreSatisfaction.value >= 1 &&
    scoreEmotionalBalance.value >= 1 &&
    scoreProductivity.value >= 1 &&
    scoreRelationships.value >= 1 &&
    scoreValuesAlignment.value >= 1;
});

// Pole pro ratingy
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
    alert('Hodnocení vašeho týdne bylo úspěšně uloženo.');
    closeDialog();
  } catch (e: any) {
    error.value = 'Chyba při ukládání poznámky.';
    alert('Vyskytla se chyba. Nepodařilo se uložit hodnocení Vašeho týdne.');
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  visible.value = false;
};
</script>
