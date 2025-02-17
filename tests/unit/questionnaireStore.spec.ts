import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useQuestionnaireStore } from '../../src/stores/questionnaireStore'

describe('Questionnaire Store', () => {
  let store: ReturnType<typeof useQuestionnaireStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useQuestionnaireStore();
  });

  it('updates field using updateField', () => {
    store.updateField('gender', 'male');
    expect(store.gender).toBe('male');

    store.updateField('eatingHabits', 'optimal');
    expect(store.eatingHabits).toBe('optimal');
  });

  it('calculates adjusted life expectancy using desiredAgeCalculated', () => {
    store.updateField('desiredAgeCalculated', 80);
    store.updateField('activityLifeGain', 5);
    store.updateField('dietLifeGain', 10);
    store.updateField('alcoholLifeLoss', 2);
    store.updateField('smokingDaysLost', 365);
    store.updateField('smokingAdditionalDaysLost', 730);

    const expected = 90;
    expect(store.calculateAdjustedLifeExpectancy()).toBeCloseTo(expected, 2);
    expect(store.finalLifeExpectancy).toBeCloseTo(expected, 2);
  });

  it('calculates adjusted life expectancy using lifeExpectancy object when desiredAgeCalculated is null', () => {
    store.updateField('desiredAgeCalculated', null);
    store.updateField('lifeExpectancy', {
      both: 75,
      male: 70,
      female: 80,
    });
    store.updateField('gender', 'female');
    store.updateField('activityLifeGain', 3);
    store.updateField('dietLifeGain', 4);
    store.updateField('alcoholLifeLoss', 1);
    store.updateField('smokingDaysLost', 730);
    store.updateField('smokingAdditionalDaysLost', 365);

    const expected = 83;
    expect(store.calculateAdjustedLifeExpectancy()).toBeCloseTo(expected, 2);
    expect(store.finalLifeExpectancy).toBeCloseTo(expected, 2);
  });

  it('getCurrentAge returns the correct age based on birthDate', () => {
    const currentDate = new Date('2025-06-15T00:00:00Z');
    vi.setSystemTime(currentDate);

    store.updateField('birthDate', new Date('1990-06-15T00:00:00Z'));
    expect(store.getCurrentAge()).toBe(35);

    store.updateField('birthDate', new Date('1990-06-16T00:00:00Z'));
    expect(store.getCurrentAge()).toBe(34);

    vi.useRealTimers();
  });
});
