<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="fixed inset-0 bg-black opacity-50"></div>
    <div class="bg-white p-6 rounded shadow-lg relative w-full max-w-2xl mx-4 motion-preset-pop">
      <div class="flex justify-end mb-1">
        <Button @click="closeDialog" rounded variant="outlined" icon="pi pi-times" aria-label="Close" />
      </div>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">{{ dialogHeader }}</h3>
      </div>

      <p class="mb-4">
        <strong>{{ t("app.weekDialog.range") }}</strong>
        {{ formattedStartDate }} – {{ formattedEndDate }}
      </p>

      <div v-if="isEditable">
        <div class="mb-4">
          <label for="message" class="block mb-2 text-sm font-medium text-primary-800">
            {{ t("app.weekDialog.note.label") }} <span class="text-red-500">*</span>
          </label>

          <div class="relative" style="min-height: 7rem;">
            <textarea
              id="message"
              v-model="memo"
              rows="5"
              maxlength="2000"
              required
              class="w-full h-full border border-gray-300 rounded p-2 absolute top-0 left-0 text-black bg-white"
              style="resize: none"
              :placeholder="t('app.weekDialog.note.placeholder')"
            ></textarea>
          </div>
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
            <label class="w-40 text-gray-700 text-sm font-medium text-primary-800">
              {{ field.label }}<span class="text-red-500">*</span>:
            </label>
            <RatingStars
              :modelValue="getRating(field.key)"
              @update:modelValue="updateRating(field.key, $event)"
              :readonly="false"
            />
          </div>
        </div>


        <div class="flex justify-end gap-4 mt-6">
          <Button
            :label="t('app.weekDialog.buttons.save')"
            @click="saveMemo"
            :disabled="loading || !isFormValid"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          />
          <Button
            :label="t('app.weekDialog.buttons.cancel')"
            @click="closeDialog"
            :disabled="loading"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          />
        </div>
        <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      </div>

      <div v-else>
        <p class="mb-4 max-h-72 overflow-y-scroll">
          {{ week.additionalInfo || t('app.weekDialog.notAvailable') }}
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
            <RatingStars
              :modelValue="getRating(field.key)"
              :readonly="true"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="w-40 text-gray-700">{{ t('app.weekDialog.totalScore') }}</label>
            <RatingStars :modelValue="week.total_score / 5" :readonly="true" />
          </div>
        </div>

        <div class="flex justify-end">
          <Button
            :label="t('app.weekDialog.buttons.close')"
            @click="closeDialog"
            class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { startOfISOWeek, addWeeks, isSameDay } from 'date-fns';
import { useLifeStore } from '@/stores/lifeStore';
import { useToast } from 'primevue/usetoast';
import RatingStars from './RatingStars.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  return t('app.weekDialog.header', { weekNumber: props.week.weekNumber, year: props.week.year });
});

const formattedStartDate = ref('');
const formattedEndDate = ref('');
onMounted(() => {
  formattedStartDate.value = formatDate(props.week.startDate);
  formattedEndDate.value = formatDate(props.week.endDate);
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
    label: t('app.weekDialog.rating.satisfaction'),
    key: 'score_satisfaction',
    tooltip: t('app.weekDialog.rating.tooltips.satisfaction')
  },
  {
    label: t('app.weekDialog.rating.emotionalBalance'),
    key: 'score_emotional_balance',
    tooltip: t('app.weekDialog.rating.tooltips.emotionalBalance')
  },
  {
    label: t('app.weekDialog.rating.productivity'),
    key: 'score_productivity',
    tooltip: t('app.weekDialog.rating.tooltips.productivity')
  },
  {
    label: t('app.weekDialog.rating.relationships'),
    key: 'score_relationships',
    tooltip: t('app.weekDialog.rating.tooltips.relationships')
  },
  {
    label: t('app.weekDialog.rating.valuesAlignment'),
    key: 'score_values_alignment',
    tooltip: t('app.weekDialog.rating.tooltips.valuesAlignment')
  }
];

const getRating = (key: string): number => {
  switch (key) {
    case 'score_satisfaction':
      return scoreSatisfaction.value;
    case 'score_emotional_balance':
      return scoreEmotionalBalance.value;
    case 'score_productivity':
      return scoreProductivity.value;
    case 'score_relationships':
      return scoreRelationships.value;
    case 'score_values_alignment':
      return scoreValuesAlignment.value;
    default:
      return 0;
  }
};

const updateRating = (key: string, newVal: number) => {
  switch (key) {
    case 'score_satisfaction':
      scoreSatisfaction.value = newVal;
      break;
    case 'score_emotional_balance':
      scoreEmotionalBalance.value = newVal;
      break;
    case 'score_productivity':
      scoreProductivity.value = newVal;
      break;
    case 'score_relationships':
      scoreRelationships.value = newVal;
      break;
    case 'score_values_alignment':
      scoreValuesAlignment.value = newVal;
      break;
  }
};

const saveMemo = async () => {
  error.value = '';

  if (!isFormValid.value) {
    error.value = t('app.weekDialog.validation.requiredFields');
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
      summary: t('app.weekDialog.toast.successSummary'),
      detail: t('app.weekDialog.toast.successDetail'),
      life: TOAST_DURATION_IN_MS
    });
    closeDialog();
  } catch (e: any) {
    error.value = t('app.weekDialog.validation.saveError');
    toast.add({
      severity: 'error',
      summary: t('app.weekDialog.toast.errorSummary'),
      detail: t('app.weekDialog.toast.errorDetail'),
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
