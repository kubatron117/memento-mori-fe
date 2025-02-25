<template>
  <span>
    <i class="pi pi-info-circle ml-1 cursor-pointer" @click="openDialog"></i>

    <Dialog
      v-model:visible="visible"
      modal
      header="Informace"
      :style="{ width: '25rem' }"
      :draggable="false"
    >
      <div class="p-4">
        <div v-if="label" class="mb-3">
          <span class="font-semibold text-lg">{{ label }}</span>
        </div>
        <div v-if="studyTitle" class="mb-3">
          <span class="font-semibold">Na základě:</span>
          <p>{{ studyTitle }}</p>
        </div>
        <div v-if="studyLink" class="mb-3">
          <span class="font-semibold">Odkaz na studii:</span>
          <Button as="a" variant="link" label="odkaz" :href="studyLink" target="_blank" rel="noopener" />
        </div>
      </div>
      <template #footer>
        <Button label="Zavřít" severity="secondary" @click="closeDialog" />
      </template>
    </Dialog>
  </span>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

interface Props {
  label?: string;
  studyTitle?: string;
  studyLink?: string;
}

const props = defineProps<Props>();

const visible = ref(false);

const openDialog = () => {
  visible.value = true;
};

const closeDialog = () => {
  visible.value = false;
};
</script>

<style scoped>
</style>
