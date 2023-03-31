<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="input-group my-3">
          <input
              type="text"
              class="form-control"
              placeholder="Search users"
              v-model="searchQuery"
              @input="searchUsers"
          />
        </div>
        <div v-if="searchResults.length > 0">
          <ul class="list-group">
            <li class="list-group-item" v-for="user in searchResults" :key="user.id">
              {{ user.name }}
            </li>
          </ul>
        </div>
        <div v-else-if="searchInProgress" class="text-center my-3">
          <span>Loading...</span>
        </div>
        <div v-else class="text-center my-3">
          <span>No results found.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { usersRef } from '@/plugins/firebaseDB'
import { query, where, getDocs } from 'firebase/firestore'
import type { Profile } from '@/models/profile.model'

export default defineComponent({
  setup() {
    const searchQuery = ref('')
    const searchResults = ref<Profile[]>([])
    const searchInProgress = ref(false)

    const searchUsers = async () => {
      searchInProgress.value = true
      if (searchQuery.value.trim()) {
        const q = query(usersRef, where('name', '>=', searchQuery.value), where('name', '<=', searchQuery.value + '\uf8ff'))
        const querySnapshot = await getDocs(q)
        searchResults.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Profile))
      } else {
        searchResults.value = []
      }
      searchInProgress.value = false
    }

    return { searchQuery, searchResults, searchUsers, searchInProgress }
  },
})
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>