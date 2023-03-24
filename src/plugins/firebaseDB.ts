import { collection, doc, getFirestore, getDoc, getDocs, query, where } from 'firebase/firestore'
import { firebaseApp } from '@/firebase'
import type { Profile } from '@/models/profile.model'
import type { Post } from '@/models/post.model'
import type { Follow } from '@/models/follow.model'
import type { Like } from '@/models/like.model'

const db = getFirestore(firebaseApp)
const usersRef = collection(db, 'users')
const postsRef = collection(db, 'posts')
const followsRef = collection(db, 'follows')
const likesRef = collection(db, 'likes')

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

const fetchPost = async (): Promise<Post[]> => {
  const querySnapshot = await getDocs(postsRef)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Post[]
}

const fetchFollow = async (userId: string): Promise<Follow[]> => {
  const q = query(followsRef, where('followerId', '==', userId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as unknown as Follow[]
}

const fetchLike = async (postId: string): Promise<Like[]> => {
  const q = query(likesRef, where('postId', '==', postId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as unknown as Like[]
}

export { usersRef, followsRef, likesRef, postsRef, fetchProfile, fetchPost, fetchFollow, fetchLike }
