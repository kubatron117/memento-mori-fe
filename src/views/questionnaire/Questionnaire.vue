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
          <div class="bg-pink-300 min-h-[80vh]">
            <component :is="step.component" />
          </div>

          <Button
            label="Přeskočit"
            class="p-button-secondary"
            @click="activateCallback(getNextStepId(step.id))"
          />

          <div class="flex justify-between bg-blue-200">
            <Button
              :class="['p-button-secondary mr-2', { 'invisible': step.id === steps[0].id }]"
              label="Zpět"
              icon="pi pi-arrow-left"
              @click="activateCallback(getPreviousStepId(step.id))"
            />
            <Button
              :class="{ 'invisible': step.id === steps[steps.length - 1].id }"
              label="Další"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback(getNextStepId(step.id))"
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

import StepNationality from '@/components/questionnaire/steps/StepNationality.vue';
import StepGender from '@/components/questionnaire/steps/StepGender.vue';
import StepSmoking from '@/components/questionnaire/steps/StepSmoking.vue';
import StepAlcohol from '@/components/questionnaire/steps/StepAlcohol.vue';
import StepPhysicalActivity from '@/components/questionnaire/steps/StepPhysicalActivity.vue';
import StepEatingHabits from '@/components/questionnaire/steps/StepEatingHabits.vue';
import StepFinal from '@/components/questionnaire/steps/StepFinal.vue';

const steps = [
  { id: 1, title: 'Národnost', component: StepNationality },
  { id: 2, title: 'Pohlaví', component: StepGender },
  { id: 3, title: 'Kouření', component: StepSmoking },
  { id: 4, title: 'Alkohol', component: StepAlcohol },
  { id: 5, title: 'Fyzická aktivita', component: StepPhysicalActivity },
  { id: 6, title: 'Stravovací návyky', component: StepEatingHabits },
  { id: 7, title: 'Věk', component: StepFinal },
];

const activeStep = ref(1);

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
</script>
