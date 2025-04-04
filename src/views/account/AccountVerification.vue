<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import router from '@/router'
import { useLoginStore } from '@/stores/loginStore'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
          summary: t('app.accountVerification.successSummary'),
          detail: '',
          life: TOAST_DURATION_IN_MS
        });
        router.push('/login')
      })
      .catch((error) => {
        toast.add({
          severity: 'error',
          summary: t('app.accountVerification.errorSummary'),
          detail: t('app.accountVerification.errorDetail'),
          life: TOAST_DURATION_IN_MS
        });
      })
  }
})
</script>

<style scoped>

</style>
