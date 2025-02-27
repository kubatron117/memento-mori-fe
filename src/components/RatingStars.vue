<template>
  <div class="flex items-center">
    <template v-for="star in maxStars" :key="star">
      <svg
        @click="setRating(star)"
        @mouseover="hoverRating = star"
        @mouseleave="hoverRating = 0"
        :style="{
          color: star <= (hoverRating || currentRating) ? getStarColor(star) : '#D1D5DB'
        }"
        class="w-4 h-4 ms-1 cursor-pointer"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 22 20"
      >
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
      </svg>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

const props = defineProps<{
  modelValue: number;
  readonly?: boolean;
  maxStars?: number;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const readonly = computed(() => props.readonly ?? false);
const maxStars = computed(() => props.maxStars || 5);
const currentRating = computed(() => props.modelValue);

const hoverRating = ref(0);

const setRating = (rating: number) => {
  if (readonly.value) return;
  emits('update:modelValue', rating);
};

const getStarColor = (star: number) => {
  if (star === 1) {
    return '#FF0000';
  } else if (star === 2) {
    return '#FFA500';
  } else if (star === 3) {
    return '#FFDD00';
  } else if (star === 4) {
    return '#ADFF2F';
  } else if (star === 5) {
    return '#008000';
  }
  return '#D1D5DB';
};
</script>
