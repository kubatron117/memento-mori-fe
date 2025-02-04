<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'

import { AccountLoginApiService } from '@/api/accountLoginApiService'

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const acceptTerms = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const router = useRouter()

async function handleRegistration() {
  errorMessage.value = ''

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Heslo a jeho potvrzení se neshodují'
    return
  }

  if (!acceptTerms.value) {
    errorMessage.value = 'Musíte souhlasit s podmínkami'
    return
  }

  loading.value = true

  try {
    const status = await AccountLoginApiService.registration({
      email: email.value,
      password: password.value,
      'password-confirm': passwordConfirm.value
    })

    if (status === 201 || status === 200) {
      await router.push('/login')
      console.log("Registrace proběhla oka status: ", status)
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Chyba při registraci'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-surface-50 px-6 py-20 md:px-12 lg:px-20 w-full h-screen">
    <div class="bg-surface-0 p-6 shadow rounded-border w-full lg:w-6/12 mx-auto">
      <div class="text-center mb-8">
        <svg class="mb-4 mx-auto fill-surface-600 h-16" viewBox="0 0 30 32" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z" />
        </svg>
        <div class="text-surface-900 text-3xl font-medium mb-4">Registrace</div>
      </div>

      <div v-if="errorMessage" class="mb-4 text-red-600">{{ errorMessage }}</div>

      <div>
        <label for="email" class="text-surface-900 font-medium mb-2 block">Email</label>
        <InputText id="email" type="text" placeholder="Email address" class="w-full mb-4" v-model="email" />

        <label for="password" class="text-surface-900 font-medium mb-2 block">Heslo</label>
        <InputText id="password" type="password" placeholder="Heslo" class="w-full mb-4" v-model="password" />

        <label for="passwordConfirm" class="text-surface-900 font-medium mb-2 block">Potvrzení hesla</label>
        <InputText id="passwordConfirm" type="password" placeholder="Potvrdit heslo" class="w-full mb-4" v-model="passwordConfirm" />

        <div class="flex items-center mb-4">
          <Checkbox id="terms" v-model="acceptTerms" :binary="true" class="mr-2" />
          <label for="terms">Souhlasím s podmínkami</label>
        </div>

        <Button
          label="Registrovat"
          icon="pi pi-user"
          class="w-full"
          @click="handleRegistration"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
