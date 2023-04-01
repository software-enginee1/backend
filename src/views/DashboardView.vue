<script>
import { ref, defineComponent, onMounted } from 'vue'
import { useCurrentUser } from 'vuefire'
import { db } from '@/firebase'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'

export default defineComponent({
  setup() {
    const user = useCurrentUser()
    const posts = ref([])

    onMounted(() => {
      // getUserCount();
    })
    return {
      user
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
    </div>
  </div>
</template>
