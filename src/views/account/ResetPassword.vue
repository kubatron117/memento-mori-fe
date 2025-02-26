<template>
  <AuthLayout>
    <template #header>
      <div class="text-center mb-8">
        <svg
          class="mb-4 mx-auto fill-surface-600 h-16"
          viewBox="0 0 30 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z"
          />
        </svg>
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
