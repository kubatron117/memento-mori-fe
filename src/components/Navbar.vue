<script setup lang="ts">
import { useLoginStore } from '@/stores/loginStore';

const loginStore = useLoginStore();
</script>

<template>
  <div>
    <p>{{ loginStore.fullName }}</p>
  </div>
</template>

<style scoped>

</style>
