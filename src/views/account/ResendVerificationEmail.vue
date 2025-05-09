<template>
  <AuthLayout>
    <template #header>
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">
          {{ t('app.resend-verification-email.title') }}
        </h1>
        <p class="text-gray-600 mt-2">
          {{ t('app.resend-verification-email.subtitle') }}
        </p>
      </div>
    </template>

    <template #body>
      <Message v-if="errorMessage" severity="error" class="mb-4">
        {{ errorMessage }}
      </Message>
      <Message v-if="successMessage" severity="success" class="mb-4">
        {{ successMessage }}
      </Message>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 font-medium mb-2">
          {{ t('app.resend-verification-email.email') }}
        </label>
        <InputText
          id="email"
          type="email"
          v-model="email"
          placeholder="email@example.com"
          class="w-full"
        />
      </div>
      <Button
        :label="t('app.resend-verification-email.resend') || 'Odeslat verifikační email znovu'"
        class="w-full !bg-primary-800 text-white hover:!bg-primary-600"
        @click="resendVerificationEmail"
        :loading="loading"
      />
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import Message from 'primevue/message'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function resendVerificationEmail() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value.trim()) {
    errorMessage.value = t('app.resend-verification-email.email-required')
    return
  }

  loading.value = true
  try {
    const status = await AccountLoginApiService.verifyAccountResend({ email: email.value })
    if (status === 200 || status === 201) {
      successMessage.value = t('app.resend-verification-email.email-sent')

      toast.add({
        severity: 'success',
        summary: t('app.resend-verification-email.email-sent'),
        detail: t('app.resend-verification-email.email-sent'),
        life: TOAST_DURATION_IN_MS
      })
    }
  } catch (error: any) {
    errorMessage.value = t('app.resend-verification-email.failed')
    toast.add({
      severity: 'error',
      summary: t('app.resend-verification-email.failed'),
      detail: t('app.resend-verification-email.failed'),
      life: TOAST_DURATION_IN_MS
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
