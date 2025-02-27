<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import AuthLayout from '@/components/auth/AuthLayout.vue'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const router = useRouter()

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const acceptTerms = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const emailRegex = /^.+@.+\..+$/


const passwordLength = computed(() => password.value.length)

const passwordHasDigit = computed(() => /\d/.test(password.value))

const passwordHasSpecial = computed(() => /[^a-zA-Z\d]/.test(password.value))

const passwordsMatch = computed(() => password.value === passwordConfirm.value)

async function handleRegistration() {
  errorMessage.value = ''

  if (!firstName.value.trim()) {
    errorMessage.value = t('app.registration.firstName-required')
    return
  }
  if (firstName.value.trim().length > 50) {
    errorMessage.value = t('app.registration.firstName-max', { max: 50 }) || 'Jméno může mít maximálně 50 znaků'
    return
  }

  if (!lastName.value.trim()) {
    errorMessage.value = t('app.registration.lastName-required')
    return
  }
  if (lastName.value.trim().length > 50) {
    errorMessage.value = t('app.registration.lastName-max', { max: 50 }) || 'Příjmení může mít maximálně 50 znaků'
    return
  }

  if (!email.value.trim()) {
    errorMessage.value = t('app.registration.email-required') || 'Email je povinný'
    return
  }
  if (!emailRegex.test(email.value)) {
    errorMessage.value = t('app.errors.invalid-email-format') || 'Email musí být ve tvaru "něco@něco.něco"'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value = t('app.registration.password-too-short') || 'Heslo musí mít minimálně 8 znaků'
    return
  }
  if (password.value.length > 64) {
    errorMessage.value = t('app.registration.password-too-long') || 'Heslo může mít maximálně 64 znaků'
    return
  }
  if (!passwordHasDigit.value || !passwordHasSpecial.value) {
    errorMessage.value = t('app.registration.password-weak') || 'Heslo musí obsahovat alespoň jedno číslo a jeden speciální znak'
    return
  }
  if (!passwordsMatch.value) {
    errorMessage.value = t('app.registration.password-mismatch') || 'Hesla se neshodují'
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
      toast.add({
        severity: 'success',
        summary: 'Registrace byla úspěšná',
        detail: 'Na email Vám příjde potvrzovací email pro dokončení registrace',
        life: TOAST_DURATION_IN_MS
      });
    }
  } catch (error: any) {
    errorMessage.value = t('app.registration.registration-failed');

    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: 'Registrace nebyla úspěšná. Vyskytla se chyba.',
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
          {{ t('app.registration.title') }}
        </div>
        <span class="text-surface-600 font-medium leading-normal">
          {{ t('app.registration.already-have-account') }}
        </span>
        <RouterLink
          to="/login"
          class="font-medium underline ml-2 text-primary hover:text-gray-500 cursor-pointer"
        >
          {{ t('app.registration.login') }}
        </RouterLink>
      </div>
    </template>

    <template #body>
      <Message v-if="errorMessage" severity="error" class="mb-4">{{ errorMessage }}</Message>
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
        <div class="text-sm text-gray-500 mb-4">
          <span v-if="passwordLength < 8">
            Heslo je příliš krátké ({{ passwordLength }}/8)
          </span>
          <span v-else-if="passwordLength > 64">
            Heslo je příliš dlouhé ({{ passwordLength }}/64)
          </span>
          <span v-else>
            Heslo je v pořádku ({{ passwordLength }} znaků)
          </span>
          <br />
          <span v-if="!passwordHasDigit">
            Heslo musí obsahovat alespoň jedno číslo.
          </span>
          <br v-if="!passwordHasSpecial" />
          <span v-if="!passwordHasSpecial">
            Heslo musí obsahovat alespoň jeden speciální znak.
          </span>
        </div>

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
        <div class="text-sm mb-4" :class="passwordsMatch ? 'text-green-600' : 'text-red-600'">
          <span v-if="passwordConfirm">
            {{ passwordsMatch ? 'Hesla se shodují' : 'Hesla se neshodují' }}
          </span>
        </div>

        <label class="flex items-center mb-4 cursor-pointer">
          <Checkbox v-model="acceptTerms" :binary="true" class="mr-2" />
          <span>{{ t('app.registration.terms') }}</span>
        </label>

        <Button
          :label="t('app.registration.register')"
          icon="pi pi-user"
          class="w-full !bg-primary-800 text-white hover:!bg-primary-600"
          @click="handleRegistration"
          :loading="loading"
        />
      </div>
    </template>
  </AuthLayout>
</template>

<style scoped>
</style>
