<template>
  <AuthLayout>
    <template #header>
      <div class="text-center mb-8">
        <div class="text-surface-900 text-3xl font-medium mb-4">
          {{ t('app.reset-password.title') }}
        </div>
        <span class="text-surface-600 font-medium leading-normal">
          {{ t('app.reset-password.subtitle') }}
        </span>
      </div>
    </template>

    <template #body>
      <div v-if="errorMessage" class="mb-4 text-red-600">{{ errorMessage }}</div>
      <div v-if="successMessage" class="mb-4 text-green-600">{{ successMessage }}</div>

      <div v-if="keyExists">
        <label for="password" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.reset-password.new-password') }}
        </label>
        <InputText
          id="password"
          type="password"
          :placeholder="t('app.reset-password.new-password-placeholder')"
          class="w-full mb-4"
          v-model="password"
        />

        <label for="passwordConfirm" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.reset-password.confirm-password') }}
        </label>
        <InputText
          id="passwordConfirm"
          type="password"
          :placeholder="t('app.reset-password.confirm-password-placeholder')"
          class="w-full mb-4"
          v-model="passwordConfirm"
        />

        <Button
          :label="t('app.reset-password.submit')"
          icon="pi pi-key"
          class="!bg-primary-800 text-white hover:!bg-primary-600"
          :loading="loading"
          @click="handleResetPassword"
        />
      </div>
      <div v-else class="text-center">
        {{ t('app.reset-password.no-key') }}
      </div>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;

const key = ref<string>('')
const password = ref<string>('')
const passwordConfirm = ref<string>('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const keyExists = computed(() => key.value !== '')

onMounted(() => {
  if (route.query.key && typeof route.query.key === 'string') {
    key.value = route.query.key
  } else {
    router.push('/login')
    errorMessage.value = t('app.reset-password.no-key')
  }
})

async function handleResetPassword() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!password.value || !passwordConfirm.value) {
    errorMessage.value = t('app.errors.missing-password')
    return
  }

  loading.value = true
  try {
    const status = await AccountLoginApiService.resetPassword({
      key: key.value,
      password: password.value,
      'password-confirm': passwordConfirm.value
    })
    if (status === 200 || status === 201) {
      successMessage.value = t('app.reset-password.success')
      await router.push('/login')
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
