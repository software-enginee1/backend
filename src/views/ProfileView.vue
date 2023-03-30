<script>
import { defineComponent} from 'vue'
import { useCurrentUser } from 'vuefire'
// import { db } from '@/plugins/firebaseDB'


export default defineComponent({
  setup() {
    const user = useCurrentUser();
    // const userPosts = ref([]);
    return {
      user
    };
  },
});
</script>


<template>
  <div class="white-container">
    <div>

      <div class='card'>
        <div class='card-header'>{{ user.displayName }}</div>
        <div class='card-body'>
<!--          <div class='bio'> {{ user.metadata.bio }}</div>-->
          <div class='register-date'>
            <img src="@/assets/calendar.png" alt="calendar" width="25" height="25">
            <p> Joined {{ user.metadata.creationTime }} </p>
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
.register-date{
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
