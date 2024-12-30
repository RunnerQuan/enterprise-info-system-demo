<script setup lang="ts">
import { ref } from 'vue'
import type { EmployeeDepartment, EmployeeDepartmentRequest } from '@/types'

const props = defineProps<{
  employeeDepartment?: EmployeeDepartment | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: EmployeeDepartment | EmployeeDepartmentRequest): void
  (e: 'cancel'): void
}>()

const formData = ref<EmployeeDepartmentRequest>({
  empNo: props.employeeDepartment?.empNo ?? 0,
  deptNo: props.employeeDepartment?.deptNo ?? 0,
  edEntryDate: props.employeeDepartment?.edEntryDate ?? '',
  edLeaveDate: props.employeeDepartment?.edLeaveDate ?? null,
  edStatus: props.employeeDepartment?.edStatus ?? 1
})

const handleSubmit = () => {
  if (props.isEdit && props.employeeDepartment) {
    emit('submit', {
      ...formData.value,
      edID: props.employeeDepartment.edID
    })
  } else {
    emit('submit', formData.value)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">员工编号</label>
      <input
        v-model.number="formData.empNo"
        type="number"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">部门编号</label>
      <input
        v-model.number="formData.deptNo"
        type="number"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">入职日期</label>
      <input
        v-model="formData.edEntryDate"
        type="date"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">离职日期</label>
      <input
        v-model="formData.edLeaveDate"
        type="date"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">状态</label>
      <select
        v-model="formData.edStatus"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option :value="1">在职</option>
        <option :value="2">离职</option>
      </select>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        取消
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
      >
        {{ isEdit ? '保存' : '添加' }}
      </button>
    </div>
  </form>
</template> 