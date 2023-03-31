<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { db } from '@/firebase'

export default defineComponent({
  setup() {
    const postContent = ref("");

    async function createPost() {
      const timestamp = Date.now();

      const postData = {
        content: postContent.value,
        dateposted: timestamp,
        likes: 0,
      };

      try {
        const filler = db

      } catch (error) {
        console.log(error);
      }
    };

    return {
      postContent,
      createPost,
    };
    }
})
</script>

<template>
  <div class='create-post'>
    <div class='create-post-header'>
    </div>
    <div class='create-post-body'>
      <textarea
        v-model='postContent'
        class="typing-box"
        placeholder='What is on your mind?'
        style='resize:none;'
      />
      <div class='button-wrapper'>
        <button class='submit-button' @click='createPost'>
          <img src='@/assets/feather.png'/>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-post {
  width: 90%;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 20px;
  margin-top: 20px;
}
.typing-box{
    width: 100%;
    resize: none;
}
.button-wrapper{
  display: flex;
  justify-content: flex-end;
  /*margin-top: 1rem;*/
}
.submit-button {
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 50px;
}
.submit-button img {
  width: 35px;
  height: 35px;
}
</style>
