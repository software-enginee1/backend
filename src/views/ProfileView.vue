<script>
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useCurrentUser } from 'vuefire'
import CreatePost from '@/components/CreatePost.vue'
import UserPost from '@/components/UserPost.vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default defineComponent({
  components: {
    CreatePost,
    UserPost
  },

  setup() {
    const user = useCurrentUser()
    const bio = ref('')
    const followerCount = ref(0)
    const followingCount = ref(0)
    const userCount = ref(0)
    const userCount2 = ref(0)
    let posts = ref([])
    let formatDate = ref('')

    const stringJoinedDate = computed(() => {
      if (user.value && user.value.metadata.creationTime) {
        return JSON.stringify(user.value.metadata.creationTime).substring(5, 17)
      }
      return ''
    })
    const userUid = computed(() => {
      if (user.value && user.value.uid) {
        return JSON.stringify(user.value.uid).replace(/['"]+/g, '')
      }
      return ''
    })
    console.log(typeof userUid.value)

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
        const postRef = collection(db, 'users', userUid.value, 'posts')
        console.log('postRef:', postRef)
        const postsSnap = await getDocs(postRef)
        posts.value = postsSnap.docs.map((docSnap) => docSnap.data())
        console.log('posts: ', posts.value)
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

    onMounted(() => {
      fetchUserPosts()
      getUserBio()
      getFollowerCount()
      getFollowingCount()
    })
    return {
      user,
      bio,
      stringJoinedDate,
      userUid,
      followerCount,
      userCount,
      userCount2,
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
        <div class="card-header">{{ user.displayName }}</div>
        <div class="card-body">
          <div class="bio">{{ bio }}</div>
          <div class="register-date">
            <img src="@/assets/calendar.png" alt="calendar" width="25" height="25" />
            <p>Joined {{ stringJoinedDate }}</p>
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
        <div v-for="post in posts" :key="post.id">
          <UserPost
            :author="user.displayName"
            :date="formatDate(post.dateposted.toDate())"
            :content="post.content"
            :likes="post.likes"
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
</style>
