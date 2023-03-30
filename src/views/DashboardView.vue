<script>
import { ref, defineComponent, onMounted } from 'vue'
import { useCurrentUser } from 'vuefire'
import { db } from '@/plugins/firebaseDB'
import { collection, getDocs } from 'firebase/firestore'

export default defineComponent({
  setup() {
    const user = useCurrentUser()
    const userCount = ref(0)
    const allusers = ref(0)

    async function queryCollection() {
      const collectionRef = collection(db, 'users')
      const users = await getDocs(collectionRef)
      allusers.value = userCount.value = users.size
    }

    onMounted(() => {
      // getUserCount();
      queryCollection()
    })
    return {
      user,
      userCount
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div v-if="user">
            <div class="card-header">Welcome, {{ user.displayName }}</div>
            <div class="card-body">
              <div class="alert alert-success" role="alert">You are logged in!</div>
            </div>
          </div>
          <div v-else class="alert alert-danger" role="alert">You are not logged in!</div>
        </div>
      </div>
      <p>Total user count: {{ userCount }}</p>
    </div>
  </div>
</template>
