import { reactive } from 'vue'
import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const user = reactive({
    name: '',
    isLoggedIn: false
  })

  const router = useRouter()
  const auth = useFirebaseAuth()

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('No auth instance found')

    await signInWithEmailAndPassword(auth, email, password)

    await router.push('/')
  }

  const register = async (name: string, email: string, password: string) => {
    if (!auth) throw new Error('No auth instance found')

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, {
      displayName: name
    })

    await router.push('/')
  }

  return { user, login, register }
})
