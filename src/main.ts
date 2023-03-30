import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import {
  VueFire,
  VueFireAuth,
  VueFireFirestoreOptionsAPI,
  VueFireDatabaseOptionsAPI
} from 'vuefire'
import { firebaseApp } from '@/firebase'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth(), VueFireFirestoreOptionsAPI(), VueFireDatabaseOptionsAPI()]
})

app.mount('#app')
