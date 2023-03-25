import type { Timestamp } from '@firebase/firestore'

export interface IPost {
  id: string
  content: string
  timestamp: Timestamp
  userId: string
  likesCount: number
}
