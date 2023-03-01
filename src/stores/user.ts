import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const auth = useFirebaseAuth()

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('No auth instance found')

    await setPersistence(auth, browserLocalPersistence)
    await signInWithEmailAndPassword(auth, email, password)

    await router.push('/')
  }

  const logout = async () => {
    if (!auth) throw new Error('No auth instance found')

    await auth.signOut()
    await router.push('/login')
  }

  const register = async (name: string, email: string, password: string) => {
    if (!auth) throw new Error('No auth instance found')

    await setPersistence(auth, browserLocalPersistence)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, {
      displayName: name
    })

    await router.push('/')
  }

  return { login, logout, register }
})
