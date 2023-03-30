<script>
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useCurrentUser } from 'vuefire'
import CreatePost from '@/components/CreatePost.vue'
import { db } from '@/firebase'

// import UserPost from '@/components/UserPost.vue'
import { collection, query, where, getDocs } from 'firebase/firestore'


export default defineComponent({
  components: { CreatePost },
  // components: { UserPost },
  // components: {
  //   UserPost,
  // },
  //
  setup() {
    const user = useCurrentUser()
    const followerCount = ref(0)
    const followingCount = ref(0)
    const userCount = ref(0)
    const userCount2 = ref(0)
    let post = ref([])

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


    async function getFollowerCount() {
      try {
        const collectionRef = db.collection('post').doc('post1')
        const doc = await collectionRef.get()
        if (doc.exists) {
          console.log('Document data:', doc.data())
        } else {
          console.log('No such document!')
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function getFollowingCount() {
      try {
        const collectionRef = db.collection('users').doc(userUid).collection('following')
        const querySnapshot = await collectionRef.get()
        followingCount.value = querySnapshot.size
        console.log(followingCount.value)
      } catch (error) {
        console.log(error)
      }
    }

    // async function getUserCount() {
    //   const collectionRef = db.collection(db, 'users')
    //   const querySnapshot = await collectionRef.get()
    //   if (querySnapshot.empty) {
    //     console.log('No matching documents.')
    //     return
    //   }
    //   userCount.value = querySnapshot
    // }
    //
    // const getUserCount2 = async () => {
    //   const collectionRef = db.collection(db, 'users')
    //   const querySnapshot = await collectionRef.get()
    //   userCount2.value = querySnapshot.size
    // }

    // async function fetchUserPosts() {
    //   const postRef = collection(db, 'post').doc('post1')
    //   const postDoc = await postRef.get()
    //   post.value = postDoc.data()
    //   console.info(post.value)
    //   console.table(post.value)

    // const q = query(postRef, where('yes', '==', 'yes'))
    // const postDocs = await getDocs(q)
    // posts.value = postDocs.docs.map(doc => {
    //   const data = doc.data()
    //   return {
    //     id: doc.id,
    //     user: data.user,
    //     content: data.content,
    //     date: data.date.toDate(),
    //     likes: data.likes
    //   }
    // })
    // }

    onMounted(() => {
      getFollowerCount()
      // getUserCount()
      // getUserCount2()
      // fetchUserPosts()
      getFollowingCount()
    })
    return {
      user,
      stringJoinedDate,
      userUid,
      followerCount,
      userCount,
      userCount2,
      post
      // followingCount
    }
  }
})
</script>


<template>
  <div class='white-container'>
    <div>

      <div class='card'>
        <div class='card-header'>{{ user.displayName }}</div>
        <div class='card-body'>
          <!--          <div class='bio'> {{ user.metadata.bio }}</div>-->
          <div class='register-date'>
            <img src='@/assets/calendar.png' alt='calendar' width='25' height='25'>
            <p> Joined {{ stringJoinedDate }} </p>
          </div>
          <div class='followers'>
            <h1> {{ userUid }}</h1>
            <p> {{ followerCount }} Followers {{ follow }}</p>
            <!--            <p> {{ userCount }} total user count {{ userCount2 }}</p>-->
          </div>
        </div>
      </div>

      <div class='create-post'>
        <div class='post-box'>
          <CreatePost />
        </div>
      </div>

      <div class='posts'>
        <!--            <div v-for='post in posts' :key='post.id'>-->
        <!--              <UserPost-->
        <!--                :author='post.user'-->
        <!--                :date='post.date'-->
        <!--                :content='post.content'-->
        <!--                :likes='post.likes'-->
        <!--              />-->
        <!--            </div>-->
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
