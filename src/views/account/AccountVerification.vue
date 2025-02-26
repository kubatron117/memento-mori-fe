<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import router from '@/router'
import { useLoginStore } from '@/stores/loginStore'
import { useToast } from 'primevue/usetoast'

const route = useRoute()

const verificationKey = ref<string>('')

const toast = useToast();
const TOAST_DURATION_IN_MS = 5000;

onMounted(() => {
  if (route.query.key && typeof route.query.key === 'string') {
    verificationKey.value = route.query.key

    const loginStore = useLoginStore();
    loginStore.logoutUser();

    AccountLoginApiService.verifyAccount({
      key: verificationKey.value
    })
      .then((status) => {
        toast.add({
          severity: 'success',
          summary: 'Účet byl úspěšně ověřen.',
          detail: '',
          life: TOAST_DURATION_IN_MS
        });
        router.push('/login')
      })
      .catch((error) => {
        console.error('Chyba při ověřování účtu:', error)
        toast.add({
          severity: 'error',
          summary: 'Chyba',
          detail: 'Nepodařilo se účet ověřit.',
          life: TOAST_DURATION_IN_MS
        });
      })
  }
})
</script>

<style scoped>

</style>
