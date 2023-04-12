<template>
  <form>
    <div class="relative">
      <input
        type="search"
        id="default-search"
        class="text-white block w-full lg:w-full bg-gray-700 p-3 pr-10 outline-none rounded-lg placeholder-gray-400 appearance-none"
        placeholder="       Search for user"
        required
        v-model="searchQuery"
        @input="searchUsers"
        style="text-align: center"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      </div>
    </div>
  </form>
  <div class="container-fluid">
    <div v-if="searchResults.length > 0" class="row custom-row">
      <div class="col custom-col" v-for="user in searchResults" :key="user.id">
        <div class="card custom-card h-100">
          <div
            class="card-body text-center d-flex flex-column justify-content-center align-items-center"
          >
            <p class="card-text"></p>
            <h5>
              <router-link :to="{ name: 'Profile', params: { username: user.name } }">
                {{ user.name }}
              </router-link>
            </h5>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="searchInProgress" class="text-center my-3">
      <span>Loading...</span>
    </div>
    <div v-else class="text-center my-3">
      <span>No results found.</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { dbService } from '@/plugins/firebaseDB'
import { query, where, getDocs } from 'firebase/firestore'
import type { IProfile } from '@/models/profile.model'

export default defineComponent({
  setup() {
    const searchQuery = ref('')
    const searchResults = ref<IProfile[]>([])
    const searchInProgress = ref(false)

    const searchUsers = async () => {
      searchInProgress.value = true
      if (searchQuery.value.trim()) {
        const q = query(
          dbService.usersRef,
          where('name', '>=', searchQuery.value),
          where('name', '<=', searchQuery.value + '\uf8ff')
        )
        const querySnapshot = await getDocs(q)
        searchResults.value = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as IProfile)
        )
      } else {
        searchResults.value = []
      }
      searchInProgress.value = false
    }
    return { searchQuery, searchResults, searchUsers, searchInProgress }
  }
})
</script>

<style scoped>
.container {
  max-width: 800px;
}

.custom-card {
  background-color: #0b0b0b;
  border-radius: 0.5rem;
  height: 32px;
}

.custom-row {
  margin: 0 -0.05rem;
}

.custom-col {
  padding: 0.05rem;
}

.custom-title {
  font-size: 18px;
}

@media (min-width: 768px) {
  .custom-card {
    width: calc(100%);
  }
}
</style>
