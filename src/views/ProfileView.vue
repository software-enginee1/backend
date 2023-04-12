<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import CreatePost from '@/components/CreatePost.vue'
import UserPost from '@/components/UserPost.vue'
import { db } from '@/firebase'
import { addDoc, collection, getDocs, query, deleteDoc, where, doc } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import { useCurrentUser } from 'vuefire'

export default defineComponent({
  components: {
    CreatePost,
    UserPost
  },

  setup() {
    const route = useRoute()
    const loggedInUser = useCurrentUser()
    const username = route.params.username
    const user = ref({})
    const userJoinedDate = ref('')
    const userUid = ref('')
    const bio = ref('')
    const followerCount = ref(0)
    const followingCount = ref(0)
    const posts = ref([])
    const isFollowing = ref(false)

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
          userJoinedDate.value = new Date(user.value.joined).toLocaleDateString(undefined, { day: 'numeric', month: 'numeric', year: 'numeric' })
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
        posts.value = myPosts
        console.log('my posts:', myPosts)

        posts.value.sort((a, b) => b.dateposted.toDate() - a.dateposted.toDate())
        console.log('user post:', posts.value)
      } catch (error) {
        console.log(error)
      }
    }

    async function getIfFollowing() {
      try {
        const followingRef = collection(db, 'users', loggedInUser.value.uid, 'following')
        const followingQuery = query(followingRef, where('username', '==', user.value.name))
        const following = await getDocs(followingQuery)
        if (!following.empty) {
          isFollowing.value = true
        } else {
          isFollowing.value = false
        }
        console.log('isFollowing: ', isFollowing.value)
      } catch (error) {
        console.log(error)
      }
    }
    async function hitFollowButton() {
      try {
        const followingRef = collection(db, 'users', loggedInUser.value.uid, 'following')
        const followingQuery = query(followingRef, where('username', '==', user.value.name))
        const followingSnap = await getDocs(followingQuery)
        if (isFollowing.value) {

          if (!followingSnap.empty) {

            const followedUserRef = collection(db, 'users', userUid.value, 'followers')
            const followedUserQuery = query(
              followedUserRef,
              where('username', '==', loggedInUser.value.displayName)
            )
            const followedUserSnap = await getDocs(followedUserQuery)
            if (!followedUserSnap.empty) {
              const docId = followedUserSnap.docs[0].id
              await deleteDoc(doc(db, 'users', userUid.value, 'followers', docId))
            }
            const docId = followingSnap.docs[0].id
            await deleteDoc(doc(db, 'users', loggedInUser.value.uid, 'following', docId))
          }
        } else {

          await addDoc(followingRef, {
            username: user.value.name
          })

          await addDoc(collection(db, 'users', userUid.value, 'followers'), {
            username: loggedInUser.value.displayName
          })
        }

        isFollowing.value = !isFollowing.value

        await getFollowerCount()
        await getIfFollowing()
      } catch (error) {
        console.log(error)
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
      loggedInUser,
      isFollowing,
      hitFollowButton,
      followingCount
    }
  }
})
</script>

<template>
  <div class="white-container">
    <div>
      <div class="card">
        <div class="card-header">
          {{ user.name }}
          <div class="follow-btn-container">
            <div v-if="loggedInUser.displayName !== user.name">
              <div v-if="isFollowing">
                <button class="unfollow-btn" @click="hitFollowButton">
                  <img src="@/assets/followed.png" alt="user is followed" />
                  <span>unfollow</span>
                </button>
              </div>
              <div v-else>
                <button class="follow-btn" @click="hitFollowButton">
                  <img src="@/assets/unfollowed.png" alt="user is not followed" />
                  <span>follow</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.follow-btn-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.follow-btn-container img {
    width: 35px;
    height: 35px;
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


