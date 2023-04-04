<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import liked from '@/assets/liked.png'
import unliked from '@/assets/unliked.png'
import { likePost } from '@/plugins/firebaseDB'

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

    async function toggleLike() {
      await likePost(props.postId, props.userId)
      liking.value = !liking.value
      console.log(liking.value)
    }

    const imagePath = computed(() => {
      if (!liking.value) {
        return liked
      } else {
        return unliked
      }
    })
    watch(
      () => props.likes,
      (newLikes) => {
        console.log('Likes in UserPost component:', newLikes)
      }
    )

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
        <div class="username">@{{ author }} {{ stringPostedDate }}</div>
      </div>
      <div class="post-content">{{ content }}</div>
      <div class="post-likes">Likes: {{ likes }}</div>
    </div>
    <div class="like-button">
      <button class="liked" @click="toggleLike()">
        <img :src="imagePath" />
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

.post-left {
  width: 75%;
}

.post-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #181818;
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
