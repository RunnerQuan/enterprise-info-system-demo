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
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'customers',
    name: 'Customers',
    component: () => import('../views/CustomerView.vue')
  },
  {
    path: 'employees',
    name: 'Employees',
    component: () => import('../views/EmployeeView.vue')
  },
  {
    path: 'departments',
    name: 'Departments',
    component: () => import('../views/DepartmentView.vue')
  },
  {
    path: 'employee-departments',
    name: 'EmployeeDepartments',
    component: () => import('../views/EmployeeDepartmentView.vue')
  },
  {
    path: 'employee-search',
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
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  else if (authStore.isAuthenticated && to.path === '/login') {
    next('/dashboard')
  }
  else {
    next()
  }
})

export default router 