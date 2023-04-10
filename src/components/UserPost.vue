<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import liked from '@/assets/liked.png'
import unliked from '@/assets/unliked.png'
import { likePost } from '@/plugins/firebaseDB'
import { useCurrentUser } from 'vuefire'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase'

export default defineComponent({
  props: {
    author: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    likes: {
      type: Number,
      required: true
    },
    postId: {
      type: String,
      required: true
    },
    userId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const stringPostedDate = computed(() => {
      return JSON.stringify(props.date).replace(/['"]+/g, '')
    })

    const liking = ref(false)
    const user = useCurrentUser()
    const userUid = ref('')

    async function checkIfLiked(){
      if (user.value) {
        const userQuery = query(collection(db, 'users'), where('name', '==', user.value.displayName))
        const userSnap = await getDocs(userQuery)
        if (!userSnap.empty) {
          const userDoc = userSnap.docs[0]
          userUid.value = userDoc.id
          const likedPostsRef = doc(db, 'users', userUid.value, 'likedPosts', props.postId)
          const likedPostsSnap = await getDoc(likedPostsRef)
          liking.value = likedPostsSnap.exists()
        }
      }
    }

    async function toggleLike() {
      liking.value = await likePost(props.postId, props.userId)
      console.log(liking.value)
    }

    const imagePath = computed(() => {
      if (!liking.value) {
        return unliked
      } else {
        return liked
      }
    })
    watch(
      () => props.likes,
      (newLikes) => {
        console.log('Likes in UserPost component:', newLikes)
      }
    )

    onMounted(() => {
      checkIfLiked()
    })

    return {
      stringPostedDate,
      liking,
      toggleLike,
      imagePath
    }
  }
})
</script>

<template>
  <div class="post">
    <div class="post-left">
      <div class="post-head">
        <router-link :to='"/profile/" + author'>
          <div class="username">@{{ author }}</div>
        </router-link>
        <div class="date">{{ stringPostedDate }}</div>
      </div>
      <div class="post-content">{{ content }}</div>
      <div class="post-likes">Likes: {{ likes }}</div>
    </div>
    <div class="like-button">
      <button class="liked" @click="toggleLike()">
        <img :src="imagePath" alt='like button'/>
      </button>
    </div>
  </div>
</template>

<style scoped>
.post {
    display: flex;
    justify-content: space-between;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    padding: 10px;
    margin-top: 10px;
}

.username:hover {
    color: blue;
}

.post-head {
    display: flex;
    align-items: center;
    color: #181818;
}

.date {
    margin-left: 5px;
    font-size: 14px;
}

.post-content {
    margin-top: 10px;
    margin-bottom: 10px;
    color: #181818;
}

.post-likes {
    color: #181818;
}

.like-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25%;
}

.liked {
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
}

.liked img {
    width: 50px;
    height: 50px;
}
</style>
