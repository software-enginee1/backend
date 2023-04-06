<template>
  <div class="container">
    <div v-if="loading" class="text-center my-3">
      <span>Loading...</span>
    </div>
    <div v-else-if="error" class="text-center my-3">
      <span>Error: {{ error }}</span>
    </div>
    <div v-else>
      <h3>All Users:</h3>
      <ul class="list-group">
        <li class="list-group-item" v-for="(name, index) in userNames" :key="index">
          {{ name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { usersRef } from '@/plugins/firebaseDB'
import { getDocs } from 'firebase/firestore'

export default defineComponent({
  setup() {
    const userNames = ref<string[]>([])
    const loading = ref(true)
    const error = ref('')

    onMounted(async () => {
      try {
        const querySnapshot = await getDocs(usersRef)
        userNames.value = querySnapshot.docs.map((doc) => doc.data().name)
        console.log('Fetched users:', userNames.value)
      } catch (err: any) {
        console.error('Error fetching users:', err)
        error.value = err.message
      } finally {
        loading.value = false
      }
    })

    return { userNames, loading, error }
  }
})
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
