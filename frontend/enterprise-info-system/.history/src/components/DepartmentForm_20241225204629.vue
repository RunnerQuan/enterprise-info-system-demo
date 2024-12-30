<script setup lang="ts">
import { ref } from 'vue'
import type { Department } from '@/types'

const props = defineProps<{
  department?: Department
  isEdit?: boolean
}>()

const emit = defineEmits<{
  submit: [department: Omit<Department, 'deptNo'> | Department]
  cancel: []
}>()

const form = ref({
  deptName: props.department?.deptName ?? '',
  deptPeopleCount: props.department?.deptPeopleCount ?? 0
})

const handleSubmit = () => {
  const departmentData = {
    ...form.value,
    deptPeopleCount: Number(form.value.deptPeopleCount)
  }
  
  if (props.isEdit && props.department) {
    emit('submit', { ...departmentData, deptNo: props.department.deptNo })
  } else {
    emit('submit', departmentData)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">部门名称</label>
        <input
          v-model="form.deptName"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">部门人数</label>
        <input
          v-model.number="form.deptPeopleCount"
          type="number"
          min="0"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
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