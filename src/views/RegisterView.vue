<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/plugins/firebaseAuth'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)

const router = useRouter()

const shouldDisableForm = ref(() => {
  return name.value === '' || email.value === '' || password.value === ''
})

const Register = async () => {
  await register(name.value, email.value, password.value)
    .then(() => {
      error.value = null
      router.push('/')
    })
    .catch((err) => {
      error.value = err.message
    })
}
</script>

<template>
  <div class="flex flex-col items-center content-center gap-9">
    <h1 class="text-3xl font-bold">Get Started</h1>
    <form class="flex flex-col content-center gap-4" action="#" @submit.prevent="Register">
      <div class="form-group">
        <label for="name" class="font-bold">Name</label>
        <input
          id="name"
          type="text"
          class="form-control"
          name="name"
          value
          required
          autofocus
          v-model="name"
        />
      </div>

      <div class="form-group">
        <label for="email" class="font-bold">Email</label>
        <input
          id="email"
          type="email"
          class="form-control"
          name="email"
          value
          required
          autofocus
          v-model="email"
        />
      </div>

      <div class="form-group">
        <label for="password" class="font-bold">Password</label>
        <input
          id="password"
          type="password"
          class="form-control"
          name="password"
          required
          v-model="password"
        />
      </div>

      <div class="form-group self-center mt-5">
        <p class="text-red-400">{{ error }}</p>
      </div>

      <div class="form-group self-center m-5">
        <button type="submit" class="btn" :disabled="shouldDisableForm()">Register</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-group {
  @apply flex flex-col gap-1;
}

.form-control {
  @apply outline-none rounded text-black p-2 w-64 transition-shadow;
}

.form-control:focus {
  @apply outline-none shadow-lg shadow-indigo-500/50;
}

.btn {
  @apply font-bold py-2 px-4 rounded text-white bg-indigo-500 shadow-lg shadow-indigo-500/50 transition-shadow;
}

.btn:hover {
  @apply shadow-xl shadow-indigo-500/50;
}

.btn:disabled {
  @apply bg-indigo-300 cursor-not-allowed;
}

.btn:disabled:hover {
  @apply bg-indigo-300 cursor-not-allowed shadow-lg shadow-indigo-500/50;
}
</style>
