import { setActivePinia, createPinia } from 'pinia';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { useLifeLossSmokingStore } from '../../src/stores/lifeLossSmokingStore';

let questionnaireStoreMock: {
  gender: string | null;
  birthDate: Date | null;
  updateField: (...args: any[]) => void;
  smokingDaysLost: number;
  smokingAdditionalDaysLost: number;
};

vi.mock('@/stores/questionnaireStore', () => ({
  useQuestionnaireStore: () => questionnaireStoreMock,
}));

describe('LifeLossSmokingStore', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2020-01-01') });
    setActivePinia(createPinia());
    questionnaireStoreMock = {
      gender: null,
      birthDate: null,
      updateField: vi.fn(),
      smokingDaysLost: 0,
      smokingAdditionalDaysLost: 0,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 if any input values are missing', () => {
    const store = useLifeLossSmokingStore();
    store.smoking = 'no';
    store.cigarettesPerDay = 10;
    store.startAge = 20;
    store.planToQuit = true;
    store.quitTimeFrame = 15;
    store.calculateLifeLoss();
    expect(store.daysLost).toBe(0);
    expect(store.additionalDaysLost).toBe(0);
  });

  it('correctly calculates lost days for a male with a specified planned quit age', () => {
    const store = useLifeLossSmokingStore();
    store.smoking = 'yes';
    store.cigarettesPerDay = 10;
    store.startAge = 20;
    store.planToQuit = true;
    store.quitTimeFrame = 5;
    questionnaireStoreMock.gender = 'male';
    questionnaireStoreMock.birthDate = new Date('1990-01-01');
    store.calculateLifeLoss();
    const lostMinutesPerCigarette = 17;
    const currentAge = 30;
    const yearsSmoking = currentAge - 20;
    const daysSmoking = yearsSmoking * 365;
    const dailyLossInDays = (10 * lostMinutesPerCigarette) / 1440;
    const expectedDaysLost = daysSmoking * dailyLossInDays;
    const additionalYears = 5;
    const additionalDaysSmoking = additionalYears * 365;
    const expectedAdditionalDaysLost = dailyLossInDays * additionalDaysSmoking;
    expect(store.daysLost).toBeCloseTo(expectedDaysLost, 2);
    expect(store.additionalDaysLost).toBeCloseTo(expectedAdditionalDaysLost, 2);
  });

  it('correctly calculates lost days for a female without a specified planned quit age', () => {
    const store = useLifeLossSmokingStore();
    store.smoking = 'yes';
    store.cigarettesPerDay = 20;
    store.startAge = 25;
    store.planToQuit = false;
    store.quitTimeFrame = null;
    questionnaireStoreMock.gender = 'female';
    questionnaireStoreMock.birthDate = new Date('1980-01-01');
    store.calculateLifeLoss();
    const lostMinutesPerCigarette = 22;
    const currentAge = 40;
    const yearsSmoking = currentAge - 25;
    const daysSmoking = yearsSmoking * 365;
    const dailyLossInDays = (20 * lostMinutesPerCigarette) / 1440;
    const expectedDaysLost = daysSmoking * dailyLossInDays;
    const additionalYears = 80 - currentAge;
    const additionalDaysSmoking = additionalYears * 365;
    const expectedAdditionalDaysLost = dailyLossInDays * additionalDaysSmoking;
    expect(store.daysLost).toBeCloseTo(expectedDaysLost, 2);
    expect(store.additionalDaysLost).toBeCloseTo(expectedAdditionalDaysLost, 2);
  });

  it('returns 0 if smoking years would be negative', () => {
    const store = useLifeLossSmokingStore();
    store.smoking = 'yes';
    store.cigarettesPerDay = 5;
    store.startAge = 40;
    store.planToQuit = true;
    store.quitTimeFrame = 30;
    questionnaireStoreMock.gender = 'male';
    questionnaireStoreMock.birthDate = new Date('2000-01-01');
    store.calculateLifeLoss();
    expect(store.daysLost).toBe(0);
    expect(store.additionalDaysLost).toBe(0);
  });

  it('correctly calls updateMainStore and updates questionnaireStore', () => {
    const store = useLifeLossSmokingStore();
    store.smoking = 'yes';
    store.cigarettesPerDay = 10;
    store.startAge = 20;
    store.planToQuit = true;
    store.quitTimeFrame = 5;
    questionnaireStoreMock.gender = 'male';
    questionnaireStoreMock.birthDate = new Date('1990-01-01');
    store.calculateLifeLoss();
    store.updateMainStore();
    expect(questionnaireStoreMock.updateField).toHaveBeenCalledWith('smokingDaysLost', store.daysLost);
    expect(questionnaireStoreMock.updateField).toHaveBeenCalledWith('smokingAdditionalDaysLost', store.additionalDaysLost);
  });
});
