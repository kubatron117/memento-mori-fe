import { setActivePinia, createPinia } from 'pinia'
import { reactive, nextTick } from 'vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDietStore } from '../../src/stores/lifeGainEatingStore'

vi.useFakeTimers()
vi.setSystemTime(new Date('2025-06-15'))

const mockUpdateField = vi.fn()

const baseMock = {
  birthDate: new Date('2000-01-01'),
  gender: 'female',
  eatingHabits: 'optimal',
  getCurrentAge: () => {
    if (!mockQuestionnaireStore.birthDate) return 0
    const today = new Date()
    let age = today.getFullYear() - mockQuestionnaireStore.birthDate.getFullYear()
    const m = today.getMonth() - mockQuestionnaireStore.birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < mockQuestionnaireStore.birthDate.getDate())) {
      age--
    }
    return age
  },
  updateField: mockUpdateField,
  dietLifeGain: 0,
}

let mockQuestionnaireStore = reactive({ ...baseMock })

vi.mock('@/stores/questionnaireStore', () => ({
  useQuestionnaireStore: () => mockQuestionnaireStore,
}))

describe('Diet Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockUpdateField.mockClear()
    Object.assign(mockQuestionnaireStore, baseMock)
  })

  it('should compute age using getCurrentAge', () => {
    mockQuestionnaireStore.birthDate = new Date('2000-01-01')
    const dietStore = useDietStore()
    expect(dietStore.age).toEqual(25)
  })

  it('should return 0 life gain for "typical" eating habits', () => {
    mockQuestionnaireStore.eatingHabits = 'typical'
    const dietStore = useDietStore()
    expect(dietStore.lifeGainYears).toEqual(0)
  })

  it('should calculate optimal diet life gain for a female', () => {
    const dietStore = useDietStore()
    expect(dietStore.lifeGainYears).toBeCloseTo(10.3625, 3)
  })

  it('should calculate feasible diet life gain for a male', () => {
    mockQuestionnaireStore.gender = 'male'
    mockQuestionnaireStore.eatingHabits = 'feasible'
    mockQuestionnaireStore.birthDate = new Date('1975-01-01')
    const dietStore = useDietStore()
    expect(dietStore.lifeGainYears).toBeCloseTo(5.53, 2)
  })

  it('should call updateField when lifeGainYears changes', async () => {
    mockQuestionnaireStore.birthDate = new Date('1995-01-01')
    mockQuestionnaireStore.gender = 'female'
    mockQuestionnaireStore.eatingHabits = 'optimal'
    const dietStore = useDietStore()
    await nextTick()
    expect(mockUpdateField).toHaveBeenCalledWith('dietLifeGain', dietStore.lifeGainYears)

    mockQuestionnaireStore.birthDate = new Date('1990-01-01')
    await nextTick()
    const call = mockUpdateField.mock.calls[mockUpdateField.mock.calls.length - 1]
    expect(call).toBeDefined()
    expect(call[1]).toBeCloseTo(9.6875, 2)
  })
})
