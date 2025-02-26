<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navbar from '@/components/Navbar.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import { useToast } from 'primevue/usetoast'

const { t } = useI18n()
const router = useRouter()

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;

const oldPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleChangePassword() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!oldPassword.value || !newPassword.value || !confirmNewPassword.value) {
    errorMessage.value = t('app.errors.missing-password-fields') || 'Vyplňte prosím všechna pole.'
    return
  }

  if (newPassword.value !== confirmNewPassword.value) {
    errorMessage.value = t('app.errors.password-mismatch') || 'Nová hesla se neshodují.'
    return
  }

  loading.value = true
  try {
    const status = await AccountLoginApiService.changePassword({
      password: oldPassword.value,
      'new-password': newPassword.value,
      'password-confirm': confirmNewPassword.value
    })

    if (status === 200 || status === 201) {
      successMessage.value = t('app.change-password.success') || 'Heslo bylo úspěšně změněno.'
    }
  } catch (error: any) {
    errorMessage.value = error.message || t('app.errors.change-password-failed') || 'Změna hesla selhala.'

    toast.add({
      severity: 'error',
      summary: 'Chyba',
      detail: 'Změna hesla selhala.',
      life: TOAST_DURATION_IN_MS
    });
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <Navbar />
    <div class="max-w-md mx-auto mt-8 p-4">
      <h1 class="text-2xl font-bold mb-4">
        {{ t('app.change-password.title') || 'Změna hesla' }}
      </h1>

      <div v-if="errorMessage" class="mb-4 text-red-600">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mb-4 text-green-600">
        {{ successMessage }}
      </div>

      <div class="mb-4">
        <label for="oldPassword" class="block text-surface-900 font-medium mb-2">
          {{ t('app.change-password.old-password') || 'Stávající heslo' }}
        </label>
        <InputText
          id="oldPassword"
          type="password"
          placeholder="Zadejte aktuální heslo"
          class="w-full"
          v-model="oldPassword"
        />
      </div>

      <div class="mb-4">
        <label for="newPassword" class="block text-surface-900 font-medium mb-2">
          {{ t('app.change-password.new-password') || 'Nové heslo' }}
        </label>
        <InputText
          id="newPassword"
          type="password"
          placeholder="Zadejte nové heslo"
          class="w-full"
          v-model="newPassword"
        />
      </div>

      <div class="mb-4">
        <label for="confirmNewPassword" class="block text-surface-900 font-medium mb-2">
          {{ t('app.change-password.confirm-password') || 'Potvrzení nového hesla' }}
        </label>
        <InputText
          id="confirmNewPassword"
          type="password"
          placeholder="Potvrďte nové heslo"
          class="w-full"
          v-model="confirmNewPassword"
        />
      </div>

      <Button
        :label="t('app.change-password.submit') || 'Změnit heslo'"
        class="w-full"
        :loading="loading"
        @click="handleChangePassword"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
