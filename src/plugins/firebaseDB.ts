import { collection, doc, getFirestore, getDoc } from 'firebase/firestore'
import { firebaseApp } from '@/firebase'
import type { Profile } from '@/models/profile.model'

const db = getFirestore(firebaseApp)
const usersRef = collection(db, 'users')

const fetchProfile = async (uid: string): Promise<Profile> => {
  const userDoc = doc(usersRef, uid)
  const snapshot = await getDoc(userDoc)

  if (snapshot.exists()) {
    return {
      id: uid,
      ...snapshot.data()
    }
  } else {
    throw new Error('User not found!')
  }
}

export { usersRef }
