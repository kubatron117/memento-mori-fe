<template>
  <span>
    <i class="pi pi-info-circle ml-1 cursor-pointer" @click="openDialog"></i>

    <Dialog
      v-model:visible="visible"
      modal
      :header="t('app.infoDialog.header')"
      :style="{ width: '25rem' }"
      :draggable="false"
    >
      <div class="p-4">
        <div v-if="label" class="mb-3">
          <span class="font-semibold text-lg">{{ label }}</span>
        </div>
        <div v-if="studyTitle" class="mb-3">
          <span class="font-semibold">{{ t('app.infoDialog.studyBasedOn') }}</span>
          <p>{{ studyTitle }}</p>
        </div>
        <div v-if="studyLink" class="mb-3">
          <span class="font-semibold">{{ t('app.infoDialog.studyLink') }}</span>
          <Button
            as="a"
            variant="link"
            :label="t('app.infoDialog.linkLabel')"
            :href="studyLink"
            target="_blank"
            rel="noopener"
          />
        </div>
      </div>
      <template #footer>
        <Button :label="t('app.infoDialog.close')" severity="secondary" @click="closeDialog" />
      </template>
    </Dialog>
  </span>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
