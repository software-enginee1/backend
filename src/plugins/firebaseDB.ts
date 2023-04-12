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
  setDoc,
  deleteDoc,
  addDoc
} from 'firebase/firestore'
import { firebaseApp } from '@/firebase'
import type { IProfile } from '@/models/profile.model'
import type { IPost } from '@/models/post.model'
import type { IFollow } from '@/models/follow.model'

const db = getFirestore(firebaseApp)
const usersRef = collection(db, 'users')
const postsRef = collection(db, 'posts')
const followsRef = collection(db, 'follows')

const fetchProfile = async (uid: string): Promise<IProfile> => {
  const userDoc = doc(usersRef, uid)
  const snapshot = await getDoc(userDoc)

  if (snapshot.exists()) {
    return {
      name: '',
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
  return !isAlreadyLikePost
}

const follow = async (userId: string, followerId: string) => {
  const userRef = collection(db, 'users', userId, 'following')
  const followerRef = collection(db, 'users', followerId, 'followers')
  await addDoc(userRef, { userId: followerId })
  await addDoc(followerRef, { userId: userId })
}

const unFollow = async (userId: string, followerId: string) => {
  const userDoc = await getDocs(
    query(collection(db, 'users', userId, 'following'), where('userId', '==', followerId))
  )
  const followerDoc = await getDocs(
    query(collection(db, 'users', followerId, 'followers'), where('userId', '==', userId))
  )

  userDoc.forEach(async (doc) => {
    await deleteDoc(doc.ref)
  })

  followerDoc.forEach(async (doc) => {
    await deleteDoc(doc.ref)
  })
}

const isFollowed = async (userId: string, followerId: string) => {
  try {
    const followDocs = await getDocs(
      query(collection(db, 'users', followerId, 'followers'), where('userId', '==', userId))
    )
    return !followDocs.empty
  } catch (error) {
    console.log(error)
  }
}

export {
  usersRef,
  followsRef,
  postsRef,
  fetchProfile,
  fetchPost,
  fetchFollow,
  likePost,
  follow,
  unFollow,
  isFollowed,
  db
}
