<script>
import { ref, defineComponent, onMounted } from 'vue'
import { useCurrentUser } from 'vuefire'
import { db } from '@/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import UserPost from '@/components/UserPost.vue'
import CreatePost from '@/components/CreatePost.vue'

export default defineComponent({
  components: { CreatePost, UserPost },
  setup() {
    const user = useCurrentUser()
    const displayPosts = ref([])
    const userRef = collection(db, 'users')
    const following = ref([])
    const userUid = ref('')
    let formatDate = ref('')

    async function getFollowingPosts() {
      if (user.value) {
        try {
          const userQuery = query(userRef, where('name', '==', user.value.displayName))
          const userSnap = await getDocs(userQuery)
          if (!userSnap.empty) {
            const userDoc = userSnap.docs[0]
            userUid.value = userDoc.id
          }
          // getting users you follow
          const followingRef = collection(db, 'users', userUid.value, 'following')
          const followingSnap = await getDocs(followingRef)
          following.value = followingSnap.docs
            .map((doc) => doc.data())
            .filter((data) => Object.keys(data).length !== 0)
          console.log(following.value)

          // getting your own posts
          const myPostsRef = collection(db, 'users', userUid.value, 'posts')
          const myPostsSnap = await getDocs(myPostsRef)
          const myPosts = myPostsSnap.docs
            .map((doc) => ({ ...doc.data(), author: user.value.displayName }))
            .filter((data) => Object.keys(data).length !== 1)
          displayPosts.value = [...displayPosts.value, ...myPosts]
          console.log('my posts:', myPosts)

          // getting posts from users you follow
          for (let i = 0; i < following.value.length; i++) {
            const following_post = collection(db, 'users', following.value[i].userId, 'posts')
            const userSnap = await getDocs(following_post)
            const posts = userSnap.docs
              .map((doc) => ({ ...doc.data() }))
              .filter((data) => Object.keys(data).length !== 0)
            console.log('posts:', posts)
            displayPosts.value = [...displayPosts.value, ...posts]
          }
          displayPosts.value.sort((a, b) => b.dateposted.toDate() - a.dateposted.toDate())
          console.log('user post:', displayPosts.value)
        } catch (error) {
          console.log(error)
        }
      }
    }
    onMounted(() => {
      formatDate.value = (date) => {
        if (!date) return ''
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' }
        const dateStr = date.toLocaleDateString('en-US', options)
        const timeStr = date.toLocaleTimeString()
        return `${dateStr} ${timeStr}`
      }
      getFollowingPosts()
    })
    return {
      user,
      displayPosts,
      formatDate
    }
  }
})
</script>

<template>
  <div class="white-container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <h1 class="home">Home</h1>
          <div class="create-post">
            <div class="post-box">
              <CreatePost />
            </div>
          </div>
          <div class="posts">
            <div v-for="post in displayPosts" :key="post.postId">
              <UserPost
                :author="post.author"
                :date="formatDate(post.dateposted.toDate())"
                :content="post.content"
                :likes="post.likes"
                :post-id="post.postId"
                :user-id="post.userId"
              />
            </div>
          </div>
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
.home {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
