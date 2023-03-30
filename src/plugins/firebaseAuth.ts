import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'
import { usersRef } from '@/plugins/firebaseDB'
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

  await setDoc(doc(usersRef, userCredential.user.uid), {
    name: name,
    email: email
  })

  const postsRef = collection(usersRef, userCredential.user.uid, 'posts')
  await addDoc(postsRef, {})

  const followersRef = collection(usersRef, userCredential.user.uid, 'followers')
  await addDoc(followersRef, {})

  const followingRef = collection(usersRef, userCredential.user.uid, 'following')
  await addDoc(followingRef, {})

  const likedPostsRef = collection(usersRef, userCredential.user.uid, 'likedPosts')
  await addDoc(likedPostsRef, {})

  const bioRef = collection(usersRef, userCredential.user.uid, 'bio')
  await addDoc(bioRef, {})
}

export { login, logout, register }
