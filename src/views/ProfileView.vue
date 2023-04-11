<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import CreatePost from '@/components/CreatePost.vue'
import UserPost from '@/components/UserPost.vue'
import { db } from '@/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    CreatePost,
    UserPost
  },

  setup() {
    const route = useRoute()
    const username = route.params.username
    const user = ref({})
    const userJoinedDate = ref('')
    const userUid = ref('')
    const bio = ref('')
    const followerCount = ref(0)
    const followingCount = ref(0)
    const posts = ref([])
    let formatDate = ref('')

    async function getUser(username) {
      try {
        const collectionRef = collection(db, 'users')
        const userQuery = query(collectionRef, where('name', '==', username))
        const userSnap = await getDocs(userQuery)
        if (!userSnap.empty) {
          const userDoc = userSnap.docs[0]
          user.value = userDoc.data()
          console.log(user)
          userUid.value = userDoc.id
          await getUserBio()
          await getFollowerCount()
          await getFollowingCount()
          await fetchUserPosts()
        } else {
          console.log('user not found')
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function getUserBio() {
      try {
        const collectionRef = collection(db, 'users', userUid.value, 'bio')
        const bioRef = await getDocs(collectionRef)
        bio.value = bioRef.docs[0].data().bio
      } catch (error) {
        console.log(error)
      }
    }

    async function getFollowerCount() {
      try {
        const collectionRef = collection(db, 'users', userUid.value, 'followers')
        const followers = await getDocs(collectionRef)
        followerCount.value = followers.size - 1 //-1 to exclude the blank document added upon creation
      } catch (error) {
        console.log(error)
      }
    }

    async function getFollowingCount() {
      try {
        const collectionRef = collection(db, 'users', userUid.value, 'following')
        const following = await getDocs(collectionRef)
        followingCount.value = following.size - 1 //-1 to exclude the blank document added upon creation
      } catch (error) {
        console.log(error)
      }
    }

    async function fetchUserPosts() {
      try {
        const myPostsRef = collection(db, 'users', userUid.value, 'posts')
        const myPostsSnap = await getDocs(myPostsRef)
        const myPosts = myPostsSnap.docs
          .map((doc) => ({ ...doc.data(), author: user.value.displayName }))
          .filter((data) => Object.keys(data).length !== 1)
        posts.value = [...posts.value, ...myPosts]
        console.log('my posts:', myPosts)

        posts.value.sort((a, b) => b.dateposted.toDate() - a.dateposted.toDate())
        console.log('user post:', posts.value)
      } catch (error) {
        console.log(error)
      }

      formatDate.value = (date) => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' }
        const dateStr = date.toLocaleDateString('en-US', options)
        const timeStr = date.toLocaleTimeString()
        return `${dateStr} ${timeStr}`
      }
    }

    onBeforeMount(async () => {
      await getUser(username)
    })

    return {
      user,
      bio,
      userJoinedDate,
      userUid,
      followerCount,
      posts,
      formatDate,
      followingCount
    }
  }
})
</script>

<template>
  <div class="white-container">
    <div>
      <div class="card">
        <div class="card-header">{{ user.name }}</div>
        <div class="card-body">
          <div class="bio">{{ bio }}</div>
          <div class="register-date">
            <img src="@/assets/calendar.png" alt="calendar" />
            <p>Joined {{ userJoinedDate }}</p>
          </div>
          <div class="followers">
            <p>{{ followerCount }} Followers {{ followingCount }} Following</p>
          </div>
        </div>
      </div>

      <div class="create-post">
        <div class="post-box">
          <CreatePost />
        </div>
      </div>

      <div class="posts">
        <div v-for="post in posts" :key="post.postId">
          <UserPost
            :author="post.author"
            :date="formatDate(post.dateposted.toDate())"
            :content="post.content"
            :likes="post.likes"
            :postId="post.postId"
            :userId="post.userId"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.white-container {
  background-color: white;
  color: black;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  width: 85%;
  margin: 0 auto;
  min-height: 100vh;
}

.register-date {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.register-date img {
  width: 25px;
  height: 25px;
}
</style>
