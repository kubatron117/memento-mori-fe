<template>
  <AuthLayout>
    <template #header>
      <div class="text-center mb-8">
        <div class="text-surface-900 text-3xl font-medium mb-4">
          {{ t('app.reset-password.reset') }}
        </div>
      </div>
    </template>

    <template #body>
      <div v-if="errorMessage" class="mb-4 text-red-600">{{ errorMessage }}</div>
      <div v-if="successMessage" class="mb-4 text-green-600">{{ successMessage }}</div>

      <div>
        <label for="email" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.login.email') }}
        </label>
        <InputText
          id="email"
          type="text"
          :placeholder="t('app.login.email')"
          class="w-full mb-4"
          v-model="email"
        />

        <Button
          :label="t('app.reset-password.reset')"
          icon="pi pi-envelope"
          class="!bg-primary-800 text-white hover:!bg-primary-600"
          :loading="loading"
          @click="handleResetRequest"
        />
      </div>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleResetRequest() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value) {
    errorMessage.value = t('app.errors.missing-email')
    return
  }

  loading.value = true
  try {
    const status = await AccountLoginApiService.resetPasswordRequest({ email: email.value })
    if (status === 200 || status === 201) {
      successMessage.value = t('app.reset-password.email-was-send')
      // await router.push('/login')
    }
  } catch (error: any) {
    errorMessage.value = error.message || t('app.errors.reset-password-failed')

    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: 'Reset hesla se nezdařil.',
      life: TOAST_DURATION_IN_MS
    });
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
