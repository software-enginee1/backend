import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = reactive({
    name: '',
    isLoggedIn: false
  })

  const login = (email: string, password: string) => {
    // Do something with the email and password
    user.isLoggedIn = true
  }

  const register = (name: string, email: string, password: string) => {
    // Do something with the email, password and name
    user.isLoggedIn = true
  }

  return { user, login, register }
})
