import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { usersRef } from '@/firebase'
import { useFirebaseAuth } from 'vuefire'

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

export { login, logout, register }
