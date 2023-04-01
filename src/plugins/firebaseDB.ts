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
  arrayRemove
} from 'firebase/firestore'
import { firebaseApp } from '@/firebase'
import type { IProfile } from '@/models/profile.model'
import type { IPost } from '@/models/post.model'
import type { IFollow } from '@/models/follow.model'

const db = getFirestore(firebaseApp)
const usersRef = collection(db, 'users')
const postsRef = collection(db, 'posts')
const followsRef = collection(db, 'follows')
const followingRef = collection(db, 'following')
const likesRef = collection(db, 'likes')

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
  const isAlreadyLikePost = profile.likes?.includes(postId) ?? false

  const postDoc = doc(postsRef, postId)
  const userDoc = doc(usersRef, userId)

  if (isAlreadyLikePost) {
    // if user already liked the post, unlike it
    await updateDoc(postDoc, { likesCount: increment(-1) })
    await updateDoc(userDoc, { likes: arrayRemove(postId) })
  } else {
    await updateDoc(postDoc, { likesCount: increment(1) })
    await updateDoc(userDoc, { likes: arrayUnion(postId) })
  }
}

export {
  usersRef,
  followsRef,
  followingRef,
  likesRef,
  postsRef,
  fetchProfile,
  fetchPost,
  fetchFollow,
  likePost,
  db
}
