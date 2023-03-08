<script setup>
import { useCurrentUser } from 'vuefire'
import { logout } from '@/plugins/firebaseAuth'
import { useRouter } from 'vue-router'
import { UserCircleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const user = useCurrentUser()
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
    <div class="container">
      <nav class="flex items-center justify-between flex-wrap py-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <a class="font-bold text-3xl tracking-tight" href="/">Patreon</a>
        </div>
        <div class="block lg:hidden">
          <button
            class="flex items-center px-3 py-2 border rounded text-indigo-200 border-indigo-400 hover:text-white hover:border-white"
          >
            <svg
              class="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div class="max-lg:hidden flex items-center gap-8">
          <router-link to="/" class="link"> Home </router-link>
          <router-link to="/post" class="link" v-if="user"> Post </router-link>
          <router-link to="/profile" v-if="user">
            <UserCircleIcon class="h-8 w-8 link" />
          </router-link>
          <div
            @click="user ? Logout() : router.push('/register')"
            class="inline-block cursor-pointer text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-indigo-500 hover:bg-white mt-4 lg:mt-0"
          >
            {{ user ? 'Logout' : 'Register' }}
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.link {
  @apply block mt-4 lg:inline-block lg:mt-0 text-white hover:text-indigo-100;
}
</style>
