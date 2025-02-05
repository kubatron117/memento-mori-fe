<template>
  <div class="bg-surface-50 px-6 py-20 md:px-12 lg:px-20 w-full h-screen">
    <div class="bg-surface-0 p-6 shadow rounded-border w-full lg:w-6/12 mx-auto">
      <slot name="header"></slot>
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
