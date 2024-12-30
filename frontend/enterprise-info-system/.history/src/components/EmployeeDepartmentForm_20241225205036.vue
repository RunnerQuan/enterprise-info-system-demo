<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmployeeStore } from '@/stores/employee'
import { useDepartmentStore } from '@/stores/department'
import type { EmployeeDepartment } from '@/types'

const props = defineProps<{
  employeeDepartment?: EmployeeDepartment
  isEdit?: boolean
}>()

const emit = defineEmits<{
  submit: [employeeDepartment: Omit<EmployeeDepartment, 'edID'> | EmployeeDepartment]
  cancel: []
}>()

const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()

const form = ref({
  empNo: props.employeeDepartment?.empNo ?? '',
  deptNo: props.employeeDepartment?.deptNo ?? '',
  edEntryDate: props.employeeDepartment?.edEntryDate ?? new Date().toISOString().split('T')[0],
  edLeaveDate: props.employeeDepartment?.edLeaveDate ?? null,
  edStatus: props.employeeDepartment?.edStatus ?? 1
})

onMounted(async () => {
  await Promise.all([
    employeeStore.loadEmployees(),
    departmentStore.loadDepartments()
  ])
})

const handleSubmit = () => {
  const employeeDepartmentData = {
    ...form.value,
    empNo: Number(form.value.empNo),
    deptNo: Number(form.value.deptNo),
    edStatus: Number(form.value.edStatus) as 1 | 2
  }
  
  if (props.isEdit && props.employeeDepartment) {
    emit('submit', { ...employeeDepartmentData, edID: props.employeeDepartment.edID })
  } else {
    emit('submit', employeeDepartmentData)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">员工</label>
        <select
          v-model="form.empNo"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          v-model="form.deptNo"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">请选择部门</option>
          <option
            v-for="department in departmentStore.departments"
            :key="department.deptNo"
            :value="department.deptNo"
          >
            {{ department.deptName }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">入职日期</label>
        <input
          v-model="form.edEntryDate"
          type="date"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">离职日期</label>
        <input
          v-model="form.edLeaveDate"
          type="date"
          :min="form.edEntryDate"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">状态</label>
        <select
          v-model="form.edStatus"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option :value="1">隶属部门</option>
          <option :value="2">离开部门</option>
        </select>
      </div>
    </div>
    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="emit('cancel')"
        class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        取消
      </button>
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
      >
        {{ isEdit ? '保存' : '添加' }}
      </button>
    </div>
  </form>
</template> 