<script setup lang="ts">
import MessageToast from './components/MessageToast.vue'
</script>

<template>
  <div class="w-full min-h-screen">
    <router-view />
    <MessageToast />
  </div>
</template>
