<script lang="ts">
import { defineComponent, computed, ref } from 'vue'

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
    }
  },
  setup(props) {
    const stringPostedDate = computed(() => {
      return JSON.stringify(props.date).substring(5, 17)
    })

    const liking = ref(false)
    function toggleLike() {
      liking.value = !liking.value
    }
    return {
      stringPostedDate,
      liking,
      toggleLike
    }
  }
})
</script>

<template>
  <div class="post">
    <div class="post-left">
      <div class="post-head">
        <div class="username">{{ author }} {{ stringPostedDate }}</div>
      </div>
      <div class="post-content">{{ content }}</div>
      <div class="post-likes">{{ likes }}</div>
    </div>
    <div class="like-button">
      <button class="liked" @click="toggleLike">
        <img :src="liking ? '@/assets/liked.png' : '@/assets/unliked.png'" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.post {
  display: flex;
  justify-content: space-between;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
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
