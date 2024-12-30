<script setup lang="ts">
import { ref } from 'vue'
import type { EmployeeDepartment } from '@/types'
import { useEmployeeStore } from '@/stores/employee'
import { useDepartmentStore } from '@/stores/department'

const props = withDefaults(defineProps<{
  employeeDepartment?: EmployeeDepartment | null
  isEdit?: boolean
}>(), {
  employeeDepartment: null,
  isEdit: false
})

const emit = defineEmits<{
  (e: 'submit', data: EmployeeDepartment | Omit<EmployeeDepartment, 'edID'>): void
  (e: 'cancel'): void
}>()

const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()

const formData = ref({
  empNo: props.employeeDepartment?.empNo ?? 0,
  deptNo: props.employeeDepartment?.deptNo ?? 0,
  edEntryDate: props.employeeDepartment?.edEntryDate ?? '',
  edLeaveDate: props.employeeDepartment?.edLeaveDate ?? '',
  edStatus: props.employeeDepartment?.edStatus ?? 1
})

const handleSubmit = () => {
  const data = {
    ...formData.value,
    ...(props.isEdit && props.employeeDepartment 
      ? { edID: props.employeeDepartment.edID } 
      : {})
  }
  emit('submit', data)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">员工</label>
      <select
        v-model="formData.empNo"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
      >
        <option value="">请选择员工</option>
        <option
          v-for="employee in employeeStore.employees"
          :key="employee.empNo"
          :value="employee.empNo"
        >
          {{ employee.firstName }}{{ employee.lastName }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">部门</label>
      <select
        v-model="formData.deptNo"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
      >
        <option value="">请选择部门</option>
        <option
          v-for="dept in departmentStore.departments"
          :key="dept.deptNo"
          :value="dept.deptNo"
        >
          {{ dept.deptName }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">入职日期</label>
      <input
        type="date"
        v-model="formData.edEntryDate"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
      >
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">离职日期</label>
      <input
        type="date"
        v-model="formData.edLeaveDate"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">状态</label>
      <select
        v-model="formData.edStatus"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
      >
        <option :value="1">在职</option>
        <option :value="2">离职</option>
      </select>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        取消
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
      >
        {{ isEdit ? '保存' : '添加' }}
      </button>
    </div>
  </form>
</template> 