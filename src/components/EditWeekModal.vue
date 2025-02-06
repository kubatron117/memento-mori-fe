<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>Upravit poznámku pro týden {{ week.weekNumber }}, {{ week.year }}</h2>
      <p>
        <strong>Rozsah:</strong>
        {{ formatDate(week.startDate) }} – {{ formatDate(week.endDate) }}
      </p>
      <template v-if="isEditable">
        <textarea v-model="memo" placeholder="Zadejte poznámku"></textarea>
        <div class="score-inputs">
          <label>
            Spokojenost:
            <input type="number" min="1" max="5" v-model.number="scoreSatisfaction" />
          </label>
          <label>
            Emoční rovnováha:
            <input type="number" min="1" max="5" v-model.number="scoreEmotionalBalance" />
          </label>
          <label>
            Produktivita:
            <input type="number" min="1" max="5" v-model.number="scoreProductivity" />
          </label>
          <label>
            Vztahy:
            <input type="number" min="1" max="5" v-model.number="scoreRelationships" />
          </label>
          <label>
            Soulad hodnot:
            <input type="number" min="1" max="5" v-model.number="scoreValuesAlignment" />
          </label>
        </div>
        <div class="buttons">
          <button @click="saveMemo" :disabled="loading">Uložit</button>
          <button @click="closeModal" :disabled="loading">Zrušit</button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </template>
      <template v-else>
        <p>{{ week.additionalInfo || 'Poznámka není k dispozici.' }}</p>
        <div class="buttons">
          <button @click="closeModal">Zavřít</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { startOfISOWeek, addWeeks } from 'date-fns';
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

// Iniciační hodnoty – pokud již jsou uloženy, vezmeme je, jinak nastavíme default (např. 1)
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
    emit('close');
  } catch (e: any) {
    error.value = 'Chyba při ukládání poznámky.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
}

.score-inputs {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-inputs label {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
}

.score-inputs input {
  width: 100%;
  padding: 4px;
  font-size: 1em;
}

.buttons {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
