import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('../views/CustomerView.vue')
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('../views/EmployeeView.vue')
  },
  {
    path: '/departments',
    name: 'Departments',
    component: () => import('../views/DepartmentView.vue')
  },
  {
    path: '/employee-departments',
    name: 'EmployeeDepartments',
    component: () => import('../views/EmployeeDepartmentView.vue')
  },
  {
    path: '/employee-search',
    name: 'EmployeeSearch',
    component: () => import('../views/EmployeeSearchView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router 