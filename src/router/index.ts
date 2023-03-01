import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useFirebaseAuth } from 'vuefire'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const authPrevented = publicPages.includes(to.path)
  const isLoggedIn = useFirebaseAuth()?.currentUser ?? false

  if (authRequired && !isLoggedIn) {
    return '/login'
  }

  if (authPrevented && isLoggedIn) {
    alert("You're already logged in!")
    return '/'
  }
})

export default router
