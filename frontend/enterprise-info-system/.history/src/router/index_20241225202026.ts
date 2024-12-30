import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: 'customers',
          name: 'Customers',
          component: () => import('@/views/CustomerView.vue')
        },
        {
          path: 'employees',
          name: 'Employees',
          component: () => import('@/views/EmployeeView.vue')
        },
        {
          path: 'departments',
          name: 'Departments',
          component: () => import('@/views/DepartmentView.vue')
        },
        {
          path: 'employee-departments',
          name: 'EmployeeDepartments',
          component: () => import('@/views/EmployeeDepartmentView.vue')
        },
        {
          path: 'employee-search',
          name: 'EmployeeSearch',
          component: () => import('@/views/EmployeeSearchView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router 