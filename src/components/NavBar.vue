<script setup>
import { useCurrentUser } from 'vuefire'
import { logout } from '@/plugins/firebaseAuth'
import { useRouter } from 'vue-router'
import { UserCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'

const router = useRouter()
const showMobileNav = ref(false)
router.beforeEach(() => {
  showMobileNav.value = false
})

const user = useCurrentUser()
const username = computed(() => (user.value ? user.value.displayName : ''))
const Logout = async () =>
  logout()
    .then(() => {
      router.push('/login')
    })
    .catch((err) => {
      alert(err.message)
    })
</script>

<template>
  <div class="bg-indigo-500">
    <div class="container relative">
      <nav class="flex items-center justify-between flex-wrap py-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <a class="font-bold text-3xl tracking-tight" href="/">Patreon</a>
        </div>
        <div class="block md:hidden">
          <button
            class="flex items-center px-3 py-2 border rounded text-indigo-200 border-indigo-400 hover:text-white hover:border-white"
            @click="showMobileNav = true"
          >
            <svg
              class="fill-current h-4 w-4"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div class="max-md:hidden flex items-center justify-center gap-8">
          <SearchBar v-if="user" />
          <router-link to="/" class="link"> Home </router-link>
          <router-link to="/post" class="link" v-if="user"> Post </router-link>
          <router-link v-if="user && username" :to="`/profile/${username}`">
            <UserCircleIcon class="h-8 w-8 link" />
          </router-link>
          <div
            @click="user ? Logout() : router.push('/register')"
            class="inline-block cursor-pointer text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white mt-4 md:mt-0"
          >
            {{ user ? 'Logout' : 'Register' }}
          </div>
        </div>
      </nav>
      <nav
        v-if="showMobileNav"
        class="md:hidden absolute top-0 left-0 h-screen pb-6 w-screen bg-indigo-500 flex items-center justify-center"
      >
        <div class="flex flex-col items-center justify-center gap-8">
          <SearchBar v-if="user" class="mb-10" />
          <router-link to="/" class="link link-mobile"> Home </router-link>
          <router-link to="/post" class="link link-mobile" v-if="user"> Post </router-link>
          <router-link to="/profile/" v-if="user" class="link link-mobile"> Profile </router-link>
          <div
            @click="user ? Logout() : router.push('/register')"
            class="inline-block cursor-pointer text-lg px-6 py-4 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white mt-4 md:mt-0"
          >
            {{ user ? 'Logout' : 'Register' }}
          </div>
        </div>
        <button @click="showMobileNav = false" class="absolute top-6 right-6 link">
          <XCircleIcon class="h-8 w-8" />
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.link {
  @apply block md:inline-block md:mt-0 text-white hover:text-indigo-100;
}
.link-mobile {
  @apply text-xl;
}
</style>
