import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useQuestionnaireStore } from '@/stores/questionnaireStore';

// Drink alcohol content constants (in grams per drink)
const SMALL_BEER_10_GRAMS = 10;      // Small 10° beer: 1 drink = 10 g of alcohol
const LARGE_BEER_10_GRAMS = 16;      // Large 10° beer: 1 drink = 16 g of alcohol
const SMALL_BEER_12_GRAMS = 13.2;    // Small 12° beer: 1 drink = 13.2 g of alcohol
const LARGE_BEER_12_GRAMS = 20;      // Large 12° beer: 1 drink = 20 g of alcohol
const SHOT_GRAMS = 12.8;             // Shot: 1 drink = 12.8 g of alcohol
const WINE_GRAMS = 19.2;             // Wine: 1 drink = 19.2 g of alcohol

const THRESHOLD_LOW = 100;
const THRESHOLD_MODERATE = 200;
const THRESHOLD_HIGH = 350;

const LIFE_LOSS_LOW = 0;
const LIFE_LOSS_MODERATE = 0.5;
const LIFE_LOSS_ELEVATED = 1.5;
const LIFE_LOSS_HIGH = 4.5;

export const useAlcoholStore = defineStore('lifeLossAlcohol', () => {
  const drinksAlcohol = ref<boolean | null>(null);
  const smallBeer10 = ref<number>(0);
  const largeBeer10 = ref<number>(0);
  const smallBeer12 = ref<number>(0);
  const largeBeer12 = ref<number>(0);
  const shot = ref<number>(0);
  const wine = ref<number>(0);

  const totalAlcoholGrams = computed<number>(() => {
    return (
      smallBeer10.value * SMALL_BEER_10_GRAMS +
      largeBeer10.value * LARGE_BEER_10_GRAMS +
      smallBeer12.value * SMALL_BEER_12_GRAMS +
      largeBeer12.value * LARGE_BEER_12_GRAMS +
      shot.value * SHOT_GRAMS +
      wine.value * WINE_GRAMS
    );
  });

  const lifeLostYears = computed<number>(() => {
    const total = totalAlcoholGrams.value;
    if (total <= THRESHOLD_LOW) return LIFE_LOSS_LOW;
    if (total > THRESHOLD_LOW && total <= THRESHOLD_MODERATE) return LIFE_LOSS_MODERATE;
    if (total > THRESHOLD_MODERATE && total <= THRESHOLD_HIGH) return LIFE_LOSS_ELEVATED;
    if (total > THRESHOLD_HIGH) return LIFE_LOSS_HIGH;
    return LIFE_LOSS_LOW;
  });

  function updateMainStore() {
    const questionnaireStore = useQuestionnaireStore();
    questionnaireStore.updateField('alcoholLifeLoss', lifeLostYears.value);
    console.log('alcoholLifeLoss', questionnaireStore.alcoholLifeLoss)
  }

  watch(lifeLostYears, () => {
    updateMainStore();
  },{ immediate: true });

  function reset() {
    drinksAlcohol.value = null;
    smallBeer10.value = 0;
    largeBeer10.value = 0;
    smallBeer12.value = 0;
    largeBeer12.value = 0;
    shot.value = 0;
    wine.value = 0;
  }

  return {
    drinksAlcohol,
    smallBeer10,
    largeBeer10,
    smallBeer12,
    largeBeer12,
    shot,
    wine,
    totalAlcoholGrams,
    lifeLostYears,
    updateMainStore,
    reset,
  };
});
