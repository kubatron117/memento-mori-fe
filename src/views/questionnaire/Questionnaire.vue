<template>
  <Navbar />
  <ConfirmDialog />
  <div class="w-[97%] sm:w-[95%] max-w-[1900px] mx-auto">
    <Stepper v-model:value="activeStep" linear>
      <StepList>
        <Step v-for="step in steps" :key="step.id" :value="step.id">
          {{ step.title }}
        </Step>
      </StepList>
      <StepPanels>
        <StepPanel
          v-for="step in steps"
          :key="step.id"
          :value="step.id"
          v-slot="{ activateCallback }"
        >
          <div class="min-h-[70vh] p-4">
            <component :is="step.component" />
          </div>
          <div class="flex justify-between p-2 mt-4">
            <Button
              v-if="step.id !== steps[0].id"
              class="p-button-secondary mr-2"
              :label="t('app.stepper.stepPanel.backButton')"
              icon="pi pi-arrow-left"
              @click="activateCallback(getPreviousStepId(step.id))"
            />
            <div class="flex-1"></div>
            <Button
              v-if="step.skippable !== false"
              class="p-button-secondary mr-2"
              :label="t('app.stepper.stepPanel.skipButton')"
              @click="onSkipStep(step, activateCallback)"
            />
            <Button
              v-if="step.id !== steps[steps.length - 1].id"
              :label="t('app.stepper.stepPanel.nextButton')"
              icon="pi pi-arrow-right"
              iconPos="right"
              :disabled="!isStepValid(step)"
              v-tooltip.top="!isStepValid(step) ? (step.skippable === false ? t('app.stepper.stepPanel.stepIsForced') : t('app.stepper.stepPanel.youCanSkip')) : ''"
              @click="onNextStep(step, activateCallback)"
            />
            <Button
              v-else
              :label="t('app.stepper.stepPanel.saveButton')"
              icon="pi pi-check"
              iconPos="right"
              :disabled="!isStepValid(step)"
              @click="onSubmit"
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import Step from 'primevue/step';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';

import { useQuestionnaireStore } from '@/stores/questionnaireStore';
import { useLoginStore } from '@/stores/loginStore';
import router from '@/router';

import StepBirthDate from '@/components/questionnaire/steps/StepBirthDate.vue';
import StepNationality from '@/components/questionnaire/steps/StepNationality.vue';
import StepGender from '@/components/questionnaire/steps/StepGender.vue';
import StepSmoking from '@/components/questionnaire/steps/StepSmoking.vue';
import StepAlcohol from '@/components/questionnaire/steps/StepAlcohol.vue';
import StepPhysicalActivity from '@/components/questionnaire/steps/StepPhysicalActivity.vue';
import StepEatingHabits from '@/components/questionnaire/steps/StepEatingHabits.vue';
import StepFinal from '@/components/questionnaire/steps/StepFinal.vue';
import Navbar from '@/components/Navbar.vue';

import { useLifeLossSmokingStore } from '@/stores/lifeLossSmokingStore';
import { useAlcoholStore } from '@/stores/lifeLossAlcoholStore';
import { useActivityStore } from '@/stores/lifeGainActivityStore';
import { useDietStore } from '@/stores/lifeGainEatingStore';
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

interface StepConfig {
  id: number;
  title: string;
  component: any;
  skippable?: boolean;
  requiredField?: string;
  validate?: () => boolean;
  skip?: () => void;
}

const { t } = useI18n();

const questionnaireStore = useQuestionnaireStore();
const loginStore = useLoginStore();
const confirm = useConfirm();

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;

const steps = computed((): StepConfig[] => [
  {
    id: 1,
    title: t('app.stepper.stepPanel.dateOfBirth'),
    component: StepBirthDate,
    skippable: false,
    requiredField: 'birthDate'
  },
  {
    id: 2,
    title: t('app.stepper.stepPanel.gender'),
    component: StepGender,
    skip: () => {
      questionnaireStore.updateField('gender', null);
    },
    requiredField: 'gender'
  },
  {
    id: 3,
    title: t('app.stepper.stepPanel.nationality'),
    component: StepNationality,
    skippable: false,
    requiredField: 'nationality'
  },
  {
    id: 4,
    title: t('app.stepper.stepPanel.smoking'),
    component: StepSmoking,
    skip: () => {
      const store = useLifeLossSmokingStore();
      store.reset();
    },
    validate: () => {
      const store = useLifeLossSmokingStore();
      return store.validate();
    }
  },
  {
    id: 5,
    title: t('app.stepper.stepPanel.alcohol'),
    component: StepAlcohol,
    skip: () => {
      const store = useAlcoholStore();
      store.reset();
    },
    validate: () => {
      const store = useAlcoholStore();
      return store.drinksAlcohol !== null;
    }
  },
  {
    id: 6,
    title: t('app.stepper.stepPanel.physicalActivity'),
    component: StepPhysicalActivity,
    skip: () => {
      const store = useActivityStore();
      store.reset();
    },
    validate: () => {
      const store = useActivityStore();
      return store.exerciseType !== null && store.exerciseMinutes >= 0;
    }
  },
  {
    id: 7,
    title: t('app.stepper.stepPanel.eating'),
    component: StepEatingHabits,
    skip: () => {
      const store = useDietStore();
      store.reset();
    },
    validate: () => {
      const questionnaireStore = useQuestionnaireStore();
      return questionnaireStore.eatingHabits !== null;
    }
  },
  {
    id: 8,
    title: t('app.stepper.stepPanel.confirmation'),
    component: StepFinal,
    skippable: false,
    requiredField: 'desiredAge'
  },
]);

const activeStep = ref(1);

function getNextStepId(currentId: number): number {
  const currentIndex = steps.value.findIndex((step) => step.id === currentId);
  if (currentIndex < steps.value.length - 1) {
    return steps.value[currentIndex + 1].id;
  }
  return currentId;
}

function getPreviousStepId(currentId: number): number {
  const currentIndex = steps.value.findIndex((step) => step.id === currentId);
  if (currentIndex > 0) {
    return steps.value[currentIndex - 1].id;
  }
  return currentId;
}

function isStepValid(step: StepConfig): boolean {
  if (step.validate) return step.validate();
  if (step.requiredField) {
    return Boolean(questionnaireStore[step.requiredField]);
  }
  return true;
}

function onNextStep(step: StepConfig, activateCallback: (id: number) => void) {
  if (isStepValid(step)) {
    activateCallback(getNextStepId(step.id));
  }
}

function onSkipStep(step: StepConfig, activateCallback: (id: number) => void) {
  if (step.skip) {
    step.skip();
  } else if (step.requiredField) {
    questionnaireStore.updateField(step.requiredField, null);
  }
  activateCallback(getNextStepId(step.id));
}

async function onSubmit() {
  if (!questionnaireStore.birthDate || !questionnaireStore.desiredAge) {
    toast.add({
      severity: 'error',
      summary: t('app.stepper.save.toastError'),
      detail: t('app.stepper.save.toastErrorMessage'),
      life: TOAST_DURATION_IN_MS
    });
    return;
  }

  confirm.require({
    message: t('app.stepper.save.confirmMessage'),
    header: t('app.stepper.save.confirmHeaderTitle'),
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: t('app.stepper.save.acceptLabel'),
    rejectLabel: t('app.stepper.save.rejectLabel'),
    accept: async () => {
      const birth = new Date(questionnaireStore.birthDate);
      const estimatedLifespanDate = new Date(
        birth.getFullYear() + questionnaireStore.desiredAge,
        birth.getMonth(),
        birth.getDate()
      );

      const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedBirthDate = formatDate(birth);
      const formattedLifespan = formatDate(estimatedLifespanDate);

      const success = await loginStore.updateDates({
        date_of_birth: formattedBirthDate,
        estimated_lifespan: formattedLifespan,
      });

      if (success) {
        await router.push('/weeks-in-life');
      } else {
        toast.add({
          severity: 'error',
          summary: t('app.stepper.save.toastError'),
          detail: t('app.stepper.save.toastErrorSaveMessage'),
          life: TOAST_DURATION_IN_MS
        });
      }
    },
    reject: () => {
    }
  });
}
</script>
