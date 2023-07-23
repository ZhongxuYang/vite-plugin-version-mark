<script setup>
const version = computed(()=>{
  return import.meta.env.__NUXT_APP_VERSION_VERSION__
})
</script>
<template>
  <div>
    {{ version }}
    <NuxtWelcome />
  </div>
</template>
