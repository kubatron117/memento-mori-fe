<template>
  <div class="w-[80%] mx-auto">
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
          <div class="min-h-[80vh] p-4">
            <component :is="step.component" />
          </div>
          <div class="flex justify-between p-2 mt-4">
            <Button
              v-if="step.id !== steps[0].id"
              class="p-button-secondary mr-2"
              label="Zpět"
              icon="pi pi-arrow-left"
              @click="activateCallback(getPreviousStepId(step.id))"
            />
            <div class="flex-1"></div>
            <Button
              v-if="step.skippable !== false"
              class="p-button-secondary mr-2"
              label="Přeskočit"
              @click="activateCallback(getNextStepId(step.id))"
            />
            <Button
              v-if="step.id !== steps[steps.length - 1].id"
              label="Další"
              icon="pi pi-arrow-right"
              iconPos="right"
              :disabled="!isStepValid(step)"
              v-tooltip.top="!isStepValid(step) ? 'Tento krok je povinný, vyplňte pole' : ''"
              @click="activateCallback(getNextStepId(step.id))"
            />
            <Button
              v-else
              label="Uložit"
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
import { ref } from 'vue';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import Step from 'primevue/step';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';
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


const steps = [
  { id: 1, title: 'Datum narození', component: StepBirthDate, skippable: false, requiredField: 'birthDate' },
  { id: 2, title: 'Pohlaví', component: StepGender },
  { id: 3, title: 'Národnost', component: StepNationality },
  { id: 4, title: 'Kouření', component: StepSmoking },
  { id: 5, title: 'Alkohol', component: StepAlcohol },
  { id: 6, title: 'Fyzická aktivita', component: StepPhysicalActivity },
  { id: 7, title: 'Stravovací návyky', component: StepEatingHabits },
  { id: 8, title: 'Potvrzení', component: StepFinal, skippable: false, requiredField: 'desiredAge' },
];

const activeStep = ref(1);
const questionnaireStore = useQuestionnaireStore();
const loginStore = useLoginStore();

function getNextStepId(currentId: number): number {
  const currentIndex = steps.findIndex((step) => step.id === currentId);
  if (currentIndex < steps.length - 1) {
    return steps[currentIndex + 1].id;
  }
  return currentId;
}

function getPreviousStepId(currentId: number): number {
  const currentIndex = steps.findIndex((step) => step.id === currentId);
  if (currentIndex > 0) {
    return steps[currentIndex - 1].id;
  }
  return currentId;
}

function isStepValid(step: { requiredField?: string; skippable?: boolean }): boolean {
  if (step.requiredField) {
    return Boolean(questionnaireStore[step.requiredField]);
  }
  return true;
}

async function onSubmit() {
  if (!questionnaireStore.birthDate || !questionnaireStore.desiredAge) {
    alert('Prosím, vyplňte datum narození a zvolte očekávaný věk.');
    return;
  }
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
    alert('Chyba při aktualizaci dat.');
  }
}
</script>
