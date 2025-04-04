<template>
  <div class="bg-surface-50 px-6 py-20 md:px-12 lg:px-20 w-full h-screen">
    <div class="bg-surface-0 p-6 shadow rounded-border w-full lg:w-6/12 mx-auto">
      <div class="flex items-center justify-center mb-4">
        <img src="/memorian_logotyp.svg" class="h-8" alt="Memorian Logo" />
      </div>
      <div class="flex items-center justify-center mb-6">
        <ChangeLanguage></ChangeLanguage>
      </div>
      <slot name="header"></slot>
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChangeLanguage from '@/components/ChangeLanguage.vue'
</script>

<style scoped>
</style>
