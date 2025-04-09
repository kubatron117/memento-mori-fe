import { setActivePinia, createPinia } from 'pinia';
import { nextTick } from 'vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAlcoholStore } from '../../src/stores/lifeLossAlcoholStore'

const updateFieldMock = vi.fn();
const questionnaireStoreMock = {
  updateField: updateFieldMock,
  alcoholLifeLoss: null,
};

vi.mock('@/stores/questionnaireStore', () => ({
  useQuestionnaireStore: vi.fn(() => questionnaireStoreMock),
}));

describe('useAlcoholStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    updateFieldMock.mockClear();
  });

  it('calculates totalAlcoholGrams correctly', () => {
    const store = useAlcoholStore();
    store.smallBeer10 = 1;
    store.largeBeer10 = 2;
    store.smallBeer12 = 3;
    store.largeBeer12 = 1;
    store.shot = 2;
    store.wine = 1;
    const expected =
      1 * 10 +
      2 * 16 +
      3 * 13.2 +
      1 * 20 +
      2 * 12.8 +
      1 * 19.2;
    expect(store.totalAlcoholGrams).toBeCloseTo(expected);
  });

  it('calculates lifeLostYears correctly based on totalAlcoholGrams', async () => {
    const store = useAlcoholStore();
    store.smallBeer10 = 0;
    store.largeBeer10 = 0;
    store.smallBeer12 = 0;
    store.largeBeer12 = 0;
    store.shot = 0;
    store.wine = 0;
    await nextTick();
    expect(store.lifeLostYears).toEqual(0);

    store.smallBeer10 = 16;
    store.largeBeer10 = 0;
    store.smallBeer12 = 0;
    store.largeBeer12 = 0;
    store.shot = 0;
    store.wine = 0;
    await nextTick();
    expect(store.lifeLostYears).toEqual(0.5);

    store.smallBeer10 = 25;
    await nextTick();
    expect(store.lifeLostYears).toEqual(1.5);

    store.smallBeer10 = 40;
    await nextTick();
    expect(store.lifeLostYears).toEqual(4.5);
  });

  it('calls updateMainStore when lifeLostYears changes and updates the main store', async () => {
    const store = useAlcoholStore();
    await nextTick();
    expect(updateFieldMock).toHaveBeenCalledTimes(1);
    expect(updateFieldMock).toHaveBeenCalledWith('alcoholLifeLoss', store.lifeLostYears);
    store.smallBeer10 = 50;
    await nextTick();
    expect(updateFieldMock).toHaveBeenCalledTimes(2);
    expect(updateFieldMock).toHaveBeenCalledWith('alcoholLifeLoss', store.lifeLostYears);
  });
});
