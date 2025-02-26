<template>
  <AuthLayout>
    <template #header>
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">{{ t('app.resend-verification-email.title') || 'Znovuodeslání verifikačního emailu' }}</h1>
        <p class="text-gray-600 mt-2">
          {{ t('app.resend-verification-email.subtitle') || 'Zadejte svůj email a my vám zašleme nový verifikační odkaz.' }}
        </p>
      </div>
    </template>

    <template #body>
      <Message v-if="errorMessage" severity="error" class="mb-4">{{ errorMessage }}</Message>
      <Message v-if="successMessage" severity="success" class="mb-4">{{ successMessage }}</Message>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 font-medium mb-2">
          {{ t('app.resend-verification-email.email') || 'Email' }}
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
        class="w-full bg-black text-white hover:bg-gray-800"
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
import { AccountLoginApiService } from '@/api/accountLoginApiService'

const { t } = useI18n()

const email = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function resendVerificationEmail() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value.trim()) {
    errorMessage.value = t('app.resend-verification-email.email-required') || 'Email je povinný.'
    return
  }

  loading.value = true
  try {
    const status = await AccountLoginApiService.verifyAccountResend({ email: email.value })
    if (status === 200 || status === 201) {
      successMessage.value = t('app.resend-verification-email.email-sent') || 'Verifikační email byl úspěšně odeslán.'
    }
  } catch (error: any) {
    errorMessage.value = t('app.resend-verification-email.failed') || 'Odeslání verifikačního emailu se nezdařilo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
