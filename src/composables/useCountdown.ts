import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

export function useCountdown(targetDate: Date | null) {
  const now = ref(new Date());
  const timer = ref<number | null>(null);

  const updateNow = () => {
    now.value = new Date();
  };

  onMounted(() => {
    if (targetDate instanceof Date && !isNaN(targetDate.getTime())) {
      timer.value = window.setInterval(updateNow, 1000);
    }
  });

  onUnmounted(() => {
    if (timer.value !== null) {
      clearInterval(timer.value);
    }
  });

  watch(
    () => targetDate,
    (newDate, oldDate) => {
      if (timer.value !== null) {
        clearInterval(timer.value);
      }
      if (newDate instanceof Date && !isNaN(newDate.getTime())) {
        timer.value = window.setInterval(updateNow, 1000);
      }
    }
  );

  const remainingTime = computed(() => {
    if (!targetDate || isNaN(targetDate.getTime())) {
      return 0;
    }
    return targetDate.getTime() - now.value.getTime();
  });

  const days = computed(() => Math.floor(remainingTime.value / (1000 * 60 * 60 * 24)));
  const hours = computed(() =>
    Math.floor((remainingTime.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  const minutes = computed(() =>
    Math.floor((remainingTime.value % (1000 * 60 * 60)) / (1000 * 60))
  );
  const seconds = computed(() => Math.floor((remainingTime.value % (1000 * 60)) / 1000));

  const isTimeUp = computed(() => remainingTime.value <= 0);

  return {
    remainingTime,
    days,
    hours,
    minutes,
    seconds,
    isTimeUp,
  };
}
