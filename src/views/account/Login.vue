<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { AccountLoginApiService } from '@/api/accountLoginApiService'

const router = useRouter()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = t('app.errors.missing-email-password')
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
    errorMessage.value = error.message || t('app.errors.login-failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-surface-50 px-6 py-20 md:px-12 lg:px-20 w-full h-screen">
    <div class="bg-surface-0 p-6 shadow rounded-border w-full lg:w-6/12 mx-auto">
      <div class="text-center mb-8">
        <svg class="mb-4 mx-auto fill-surface-600 h-16" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z"
          />
        </svg>

        <div class="text-surface-900 text-3xl font-medium mb-4">{{ t('app.login.welcome-back') }}</div>
        <span class="text-surface-600 font-medium leading-normal">{{ t('app.login.dont-have-account') }}</span>
        <a class="font-medium no-underline ml-2 text-primary cursor-pointer" @click="$router.push('/registration')">
          {{ t('app.login.create-today') }}
        </a>
      </div>

      <div v-if="errorMessage" class="mb-4 text-red-600">{{ errorMessage }}</div>

      <div>
        <label for="email1" class="text-surface-900 font-medium mb-2 block">{{ t('app.login.email') }}</label>
        <InputText
          id="email1"
          type="text"
          :placeholder="t('app.login.email')"
          class="w-full mb-4"
          v-model="email"
        />

        <label for="password1" class="text-surface-900 font-medium mb-2 block">{{ t('app.login.password') }}</label>
        <InputText
          id="password1"
          type="password"
          :placeholder=" t('app.login.password')"
          class="w-full mb-4"
          v-model="password"
        />

        <div class="flex items-center justify-between mb-12">
          <a class="font-medium no-underline ml-2 text-primary text-right cursor-pointer" @click="$router.push('/forgot-password')">
            {{ t('app.login.forgot-password') }}
          </a>
        </div>

        <Button
          :label="t('app.login.sign-in')"
          icon="pi pi-user"
          class="w-full"
          :loading="loading"
          @click="handleLogin"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
