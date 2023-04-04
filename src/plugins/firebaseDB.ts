import {
  collection,
  doc,
  getFirestore,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  addDoc,
  setDoc,
  deleteDoc,
  FieldValue
} from 'firebase/firestore'
import { firebaseApp } from '@/firebase'
import type { IProfile } from '@/models/profile.model'
import type { IPost } from '@/models/post.model'
import type { IFollow } from '@/models/follow.model'
import type { Timestamp } from '@firebase/firestore'

const db = getFirestore(firebaseApp)
const usersRef = collection(db, 'users')
const postsRef = collection(db, 'posts')
const isAlreadyLikePost = false
const followsRef = collection(db, 'follows')
const followingRef = collection(db, 'following')

const fetchProfile = async (uid: string): Promise<IProfile> => {
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

const fetchPost = async (): Promise<IPost[]> => {
  const querySnapshot = await getDocs(postsRef)
  return querySnapshot.docs.map(
    (snapshot) =>
      ({
        id: snapshot.id,
        ...snapshot.data()
      } as IPost)
  )
}

const fetchFollow = async (userId: string): Promise<IFollow[]> => {
  const q = query(followsRef, where('followerId', '==', userId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as IFollow)
}

const likePost = async (postId: string, userId: string) => {
  const profile = await fetchProfile(userId)
  const postsRef = collection(db, 'users', userId, 'posts')
  const postDoc = doc(postsRef, postId)
  const userDoc = doc(usersRef, userId)

  const likeDoc = doc(userDoc, 'likedPosts', postId)
  const likedPostSnap = await getDoc(likeDoc)
  const isAlreadyLikePost = likedPostSnap.exists()
  if (isAlreadyLikePost) {
    // if user already liked the post, unlike it
    await updateDoc(postDoc, { likes: increment(-1) })
    await deleteDoc(likeDoc)
  } else {
    await updateDoc(postDoc, { likes: increment(1) })
    await setDoc(likeDoc, { postId })
  }
}

export {
  usersRef,
  followsRef,
  followingRef,
  postsRef,
  fetchProfile,
  fetchPost,
  fetchFollow,
  likePost,
  db
}
