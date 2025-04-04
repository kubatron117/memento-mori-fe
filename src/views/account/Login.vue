<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const { t } = useI18n()

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const emailRegex = /^.+@.+\..+$/

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = t('app.errors.missing-email-password')
    return
  }

  if (!emailRegex.test(email.value)) {
    errorMessage.value = t('app.errors.invalid-email-format')
    return
  }

  loading.value = true
  try {
    const status = await AccountLoginApiService.login({
      email: email.value,
      password: password.value
    })

    if (status === 200 || status === 201) {
      await router.push('/weeks-in-life')
    }
  } catch (error: any) {
    errorMessage.value = t('app.errors.login-failed')

    toast.add({
      severity: 'error',
      summary: t('app.login.errorSummary'),
      detail: t('app.login.errorDetail'),
      life: TOAST_DURATION_IN_MS
    });
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <template #header>
      <div class="text-center mb-8">
        <div class="text-surface-900 text-3xl font-medium mb-4">
          {{ t('app.login.welcome-back') }}
        </div>
        <span class="text-surface-600 font-medium leading-normal">
          {{ t('app.login.dont-have-account') }}
        </span>

        <RouterLink
          to="/registration"
          class="font-medium underline ml-2 text-primary hover:text-gray-500 cursor-pointer"
        >
          {{ t('app.login.create-today') }}
        </RouterLink>
      </div>
    </template>

    <template #body>
      <Message v-if="errorMessage" severity="error" class="mb-4">{{ errorMessage }}</Message>

      <div>
        <label for="email1" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.login.email') }}
        </label>
        <InputText
          id="email1"
          type="text"
          :placeholder="t('app.login.email')"
          class="w-full mb-4"
          v-model="email"
        />

        <label for="password1" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.login.password') }}
        </label>
        <InputText
          id="password1"
          type="password"
          :placeholder="t('app.login.password')"
          class="w-full mb-4"
          v-model="password"
        />

        <div class="flex items-center justify-between mb-2">
          <RouterLink
            to="/reset-password-request"
            class="font-medium text-gray-500 hover:text-gray-900 no-underline ml-2 text-right"
          >
            {{ t('app.login.forgot-password') }}
          </RouterLink>
        </div>

        <div class="flex items-center justify-between mb-12">
          <RouterLink
            to="/resend-verification-email"
            class="font-medium text-gray-500 hover:text-gray-900 no-underline ml-2 text-right"
          >
            {{ t('app.login.resend-verification-email') }}
          </RouterLink>
        </div>

        <Button
          :label="t('app.login.sign-in')"
          icon="pi pi-user"
          class="w-full !bg-primary-800 text-white hover:!bg-primary-600"
          :loading="loading"
          @click="handleLogin"
        />
      </div>
    </template>
  </AuthLayout>
</template>

<style scoped>
</style>
