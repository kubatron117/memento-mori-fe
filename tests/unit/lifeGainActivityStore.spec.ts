import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { nextTick } from 'vue';
import { useQuestionnaireStore } from '../../src/stores/questionnaireStore';
import { useActivityStore } from '../../src/stores/lifeGainActivityStore';

vi.mock('@/stores/questionnaireStore', () => ({
  useQuestionnaireStore: vi.fn(),
}));

describe('lifeGainActivityStore', () => {
  let mockQuestionnaireStore: { updateField: ReturnType<typeof vi.fn>; activityLifeGain: number };

  beforeEach(() => {
    setActivePinia(createPinia());
    mockQuestionnaireStore = {
      updateField: vi.fn(),
      activityLifeGain: 0,
    };
    (useQuestionnaireStore as unknown as vi.Mock).mockReturnValue(mockQuestionnaireStore);
  });

  it('calculates lifeGainYears correctly for moderate exercise', async () => {
    const activityStore = useActivityStore();
    activityStore.exerciseType = 'moderate';
    await nextTick();
    expect(activityStore.exerciseType).toBe('moderate');
    expect(activityStore.exerciseMinutes).toBe(0);
    expect(activityStore.lifeGainYears).toBe(0);
    activityStore.exerciseMinutes = 150;
    await nextTick();
    expect(activityStore.lifeGainYears).toBe(5);
    expect(mockQuestionnaireStore.updateField).toHaveBeenLastCalledWith('activityLifeGain', 5);
    activityStore.exerciseMinutes = 75;
    await nextTick();
    expect(activityStore.lifeGainYears).toBeCloseTo(2.5);
    expect(mockQuestionnaireStore.updateField).toHaveBeenLastCalledWith('activityLifeGain', 2.5);
  });

  it('calculates lifeGainYears correctly for vigorous exercise', async () => {
    const activityStore = useActivityStore();
    activityStore.exerciseType = 'vigorous';
    activityStore.exerciseMinutes = 75;
    await nextTick();
    expect(activityStore.lifeGainYears).toBe(5);
    expect(mockQuestionnaireStore.updateField).toHaveBeenLastCalledWith('activityLifeGain', 5);
    activityStore.exerciseMinutes = 37.5;
    await nextTick();
    expect(activityStore.lifeGainYears).toBeCloseTo(2.5);
    expect(mockQuestionnaireStore.updateField).toHaveBeenLastCalledWith('activityLifeGain', 2.5);
  });

  it('calls updateField when lifeGainYears changes', async () => {
    const activityStore = useActivityStore();
    activityStore.exerciseType = 'moderate';
    await nextTick();
    mockQuestionnaireStore.updateField.mockClear();
    activityStore.exerciseMinutes = 150;
    await nextTick();
    expect(mockQuestionnaireStore.updateField).toHaveBeenCalledTimes(1);
    expect(mockQuestionnaireStore.updateField).toHaveBeenCalledWith('activityLifeGain', 5);
  });
});
