import { collection, getFirestore } from 'firebase/firestore'
import { firebaseApp } from '@/firebase'

const db = getFirestore(firebaseApp)
const usersRef = collection(db, 'users')

export { usersRef }
