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

export class DBService {

  db = getFirestore(firebaseApp)
  usersRef = collection(this.db, 'users')
  postsRef = collection(this.db, 'posts')
  followsRef = collection(this.db, 'follows')

  public fetchProfile = async (uid: string): Promise<IProfile> => {
    const userDoc = doc(this.usersRef, uid)
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

  public fetchPost = async (): Promise<IPost[]> => {
    const querySnapshot = await getDocs(this.postsRef)
    return querySnapshot.docs.map(
      (snapshot) =>
        ({
          id: snapshot.id,
          ...snapshot.data()
        } as IPost)
    )
  }

  public fetchFollow = async (userId: string): Promise<IFollow[]> => {
    const q = query(this.followsRef, where('followerId', '==', userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as IFollow)
  }
  
  public likePost = async (postId: string, userId: string) => {
    const postsRef = collection(this.db, 'users', userId, 'posts')
    const postDoc = doc(postsRef, postId)
    const userDoc = doc(this.usersRef, userId)
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
  
  public follow = async (userId: string, followerId: string) => {
    const userRef = collection(this.db, 'users', userId, 'following')
    const followerRef = collection(this.db, 'users', followerId, 'followers')
    await addDoc(userRef, { userId: followerId })
    await addDoc(followerRef, { userId: userId })
  }
  
  public unFollow = async (userId: string, followerId: string) => {
    const userDoc = await getDocs(
      query(collection(this.db, 'users', userId, 'following'), where('userId', '==', followerId))
    )
    const followerDoc = await getDocs(
      query(collection(this.db, 'users', followerId, 'followers'), where('userId', '==', userId))
    )
  
    userDoc.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })
  
    followerDoc.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })
  }
  
  public isFollowed = async (userId: string, followerId: string) => {
    try {
      const followDocs = await getDocs(
        query(collection(this.db, 'users', followerId, 'followers'), where('userId', '==', userId))
      )
      return !followDocs.empty
    } catch (error) {
      console.log(error)
    }
  }
}

const dbService = new DBService()

export {
  dbService
}
