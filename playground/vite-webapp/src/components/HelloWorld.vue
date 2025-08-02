<script setup lang="ts">
import {computed} from 'vue'
const versionInfo = computed(() => `Version: ${window.__VITE_WEBAPP_VERSION__}`)
</script>

<template>
  <h1>{{ versionInfo }}</h1>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
