<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import AuthLayout from '@/components/auth/AuthLayout.vue'

const { t } = useI18n()
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const acceptTerms = ref(false)
const errorMessage = ref('')
const loading = ref(false)

async function handleRegistration() {
  errorMessage.value = ''

  if (!firstName.value.trim()) {
    errorMessage.value = t('app.registration.firstName-required')
    return
  }
  if (!lastName.value.trim()) {
    errorMessage.value = t('app.registration.lastName-required')
    return
  }

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = t('app.registration.password-mismatch')
    return
  }

  if (!acceptTerms.value) {
    errorMessage.value = t('app.registration.accept-terms')
    return
  }

  loading.value = true

  try {
    const status = await AccountLoginApiService.registration({
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value,
      'password-confirm': passwordConfirm.value,
      agree_to_terms: acceptTerms.value
    })

    if (status === 201 || status === 200) {
      await router.push('/login')
      console.log("Registrace proběhla, status:", status)
    }
  } catch (error: any) {
    errorMessage.value = error.message || t('app.registration.registration-failed')
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

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
          {{ t('app.registration.title') }}
        </div>
        <span class="text-surface-600 font-medium leading-normal">
          {{ t('app.registration.already-have-account') }}
        </span>
        <a class="font-medium no-underline ml-2 text-primary cursor-pointer" @click="goToLogin">
          {{ t('app.registration.login') }}
        </a>
      </div>
    </template>

    <template #body>
      <div v-if="errorMessage" class="mb-4 text-red-600">{{ errorMessage }}</div>

      <div>
        <label for="firstName" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.registration.firstName') }}
        </label>
        <InputText
          id="firstName"
          type="text"
          :placeholder="t('app.registration.firstName')"
          class="w-full mb-4"
          v-model="firstName"
        />

        <label for="lastName" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.registration.lastName') }}
        </label>
        <InputText
          id="lastName"
          type="text"
          :placeholder="t('app.registration.lastName')"
          class="w-full mb-4"
          v-model="lastName"
        />

        <label for="email" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.registration.email') }}
        </label>
        <InputText
          id="email"
          type="text"
          :placeholder="t('app.registration.email')"
          class="w-full mb-4"
          v-model="email"
        />

        <label for="password" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.registration.password') }}
        </label>
        <InputText
          id="password"
          type="password"
          :placeholder="t('app.registration.password')"
          class="w-full mb-4"
          v-model="password"
        />

        <label for="passwordConfirm" class="text-surface-900 font-medium mb-2 block">
          {{ t('app.registration.passwordConfirm') }}
        </label>
        <InputText
          id="passwordConfirm"
          type="password"
          :placeholder="t('app.registration.passwordConfirm')"
          class="w-full mb-4"
          v-model="passwordConfirm"
        />

        <label class="flex items-center mb-4 cursor-pointer">
          <Checkbox v-model="acceptTerms" :binary="true" class="mr-2" />
          <span>{{ t('app.registration.terms') }}</span>
        </label>

        <Button
          :label="t('app.registration.register')"
          icon="pi pi-user"
          class="w-full"
          @click="handleRegistration"
          :loading="loading"
        />
      </div>
    </template>
  </AuthLayout>
</template>

<style scoped>
</style>
