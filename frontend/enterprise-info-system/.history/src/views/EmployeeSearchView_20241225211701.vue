<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmployeeStore } from '@/stores/employee'
import { useDepartmentStore } from '@/stores/department'
import { useEmployeeDepartmentStore } from '@/stores/employeeDepartment'
import EmployeeSearchForm from '@/components/EmployeeSearchForm.vue'
import type { Employee } from '@/types'

const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
const employeeDepartmentStore = useEmployeeDepartmentStore()

const searchResults = ref<Employee[]>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      employeeStore.loadEmployees(),
      departmentStore.loadDepartments(),
      employeeDepartmentStore.loadEmployeeDepartments()
    ])
    // 初始显示所有员工
    searchResults.value = employeeStore.employees
  } finally {
    isLoading.value = false
  }
})

const handleSearch = (searchParams: {
  name: string
  department: string
  hireDateStart: string
  hireDateEnd: string
}) => {
  searchResults.value = employeeStore.searchEmployees(searchParams)
}

const handleReset = () => {
  searchResults.value = employeeStore.employees
}

// 获取员工所属部门列表
const getEmployeeDepartments = (empNo: number) => {
  return employeeDepartmentStore.getEmployeeDepartments(empNo)
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">员工信息查询</h2>

    <!-- 搜索表单 -->
    <EmployeeSearchForm
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 搜索结果 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div v-if="isLoading" class="p-4 text-center text-gray-500">
        加载中...
      </div>
      <template v-else>
        <table v-if="searchResults.length" class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                姓名
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                性别
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所属部门
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                入职日期
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                联系方式
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="employee in searchResults" :key="employee.empNo">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ employee.firstName }}{{ employee.lastName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.gender ? '男' : '女' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="dept in getEmployeeDepartments(employee.empNo)"
                    :key="dept.edID"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ dept.departmentName }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.hireDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ employee.telephone }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="p-4 text-center text-gray-500">
          未找到匹配的员工信息
        </div>
      </template>
    </div>
  </div>
</template> 