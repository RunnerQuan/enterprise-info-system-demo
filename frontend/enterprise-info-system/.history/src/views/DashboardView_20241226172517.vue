<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { useDepartmentStore } from '@/stores/department'
import { useEmployeeDepartmentStore } from '@/stores/employeeDepartment'

const router = useRouter()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
const employeeDepartmentStore = useEmployeeDepartmentStore()

const isLoading = ref(true)
const hasError = ref(false)

// 统计数据
const stats = computed(() => ({
  customers: customerStore.customers?.length || 0,
  employees: employeeStore.employees?.length || 0,
  departments: departmentStore.departments?.length || 0,
  activeEmployeeDepartments: employeeDepartmentStore.employeeDepartmentDetails?.filter(ed => ed.edStatus === 1)?.length || 0
}))

// 部门员工分布数据
const departmentDistribution = computed(() => 
  departmentStore.departments?.map(dept => ({
    name: dept.deptName,
    value: dept.deptPeopleCount
  })) || []
)

// 性别分布数据
const genderDistribution = computed(() => {
  const male = employeeStore.employees?.filter(e => e.gender === 1)?.length || 0
  const female = employeeStore.employees?.filter(e => e.gender === 0)?.length || 0
  return [
    { name: '男', value: male },
    { name: '女', value: female }
  ]
})

// 加载所有数据
const loadData = async () => {
  try {
    isLoading.value = true
    hasError.value = false
    await Promise.all([
      customerStore.loadCustomers(),
      employeeStore.loadEmployees(),
      departmentStore.loadDepartments(),
      employeeDepartmentStore.loadEmployeeDepartments()
    ])
  } catch (error) {
    console.error('加载数据失败:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="p-6">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else-if="hasError" class="text-center py-12">
      <div class="text-red-500 mb-4">加载数据失败</div>
      <button 
        @click="loadData" 
        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        重试
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 原有的卡片内容 -->
    </div>
  </div>
</template> 