<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { AccountLoginApiService } from '@/api/accountLoginApiService'
import router from '@/router'
import { useLoginStore } from '@/stores/loginStore'

const route = useRoute()

const verificationKey = ref<string>('')

onMounted(() => {
  if (route.query.key && typeof route.query.key === 'string') {
    verificationKey.value = route.query.key

    const loginStore = useLoginStore();
    loginStore.logoutUser();

    AccountLoginApiService.verifyAccount({
      key: verificationKey.value
    })
      .then((status) => {
        console.log('Ověření proběhlo, status:', status)
        router.push('/login')
      })
      .catch((error) => {
        console.error('Chyba při ověřování účtu:', error)
      })
  }
})
</script>

<style scoped>

</style>
