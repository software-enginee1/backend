<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <form>
    <div class="relative">
      <input
        type="search"
        id="default-search"
        class="text-white block w-48 lg:w-64 bg-gray-700 p-3 pr-10 outline-none rounded-lg placeholder-gray-400 appearance-none"
        placeholder="Search for user"
        required
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <MagnifyingGlassIcon class="w-5 h-5 stroke-gray-400 z-50" />
      </div>
    </div>
  </form>
</template>
