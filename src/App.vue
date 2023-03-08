<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div>
    <header class="sticky top-0 z-50">
      <NavBar />
    </header>
    <main class="relative">
      <router-view></router-view>
    </main>
  </div>
</template>
