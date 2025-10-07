<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { initializeTheme } = useTheme();

onMounted(() => {
  initializeTheme();
});
</script>

<style>
/* Global app styles are imported in main.ts */
</style>
