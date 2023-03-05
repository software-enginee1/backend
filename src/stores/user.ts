import { defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { useFirebaseAuth } from 'vuefire'
import { usersRef } from '@/firebase'

export const useUserStore = defineStore('user', () => {
  const auth = useFirebaseAuth()

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('No auth instance found')

    await setPersistence(auth, browserLocalPersistence)
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    if (!auth) throw new Error('No auth instance found')

    await auth.signOut()
  }

  const register = async (name: string, email: string, password: string) => {
    if (!auth) throw new Error('No auth instance found')

    await setPersistence(auth, browserLocalPersistence)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, {
      displayName: name
    })

    await setDoc(doc(usersRef, userCredential.user.uid), { name: name })
  }

  return { login, logout, register }
})
