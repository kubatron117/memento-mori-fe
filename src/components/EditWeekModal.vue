<!-- src/components/EditWeekModal.vue -->
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
  }
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const memo = ref(props.week.additionalInfo || '');
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
    await lifeStore.updateWeekMemo(props.week, memo.value);
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
