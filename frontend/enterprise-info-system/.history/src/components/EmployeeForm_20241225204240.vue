<script setup lang="ts">
import { ref } from 'vue'
import type { Employee } from '@/types'

const props = defineProps<{
  employee?: Employee
  isEdit?: boolean
}>()

const emit = defineEmits<{
  submit: [employee: Omit<Employee, 'empNo'> | Employee]
  cancel: []
}>()

const form = ref({
  firstName: props.employee?.firstName ?? '',
  lastName: props.employee?.lastName ?? '',
  gender: props.employee?.gender ?? 1,
  hireDate: props.employee?.hireDate ?? new Date().toISOString().split('T')[0],
  birthday: props.employee?.birthday ?? '',
  address: props.employee?.address ?? '',
  telephone: props.employee?.telephone ?? ''
})

const handleSubmit = () => {
  const employeeData = {
    ...form.value,
    gender: Number(form.value.gender)
  }
  
  if (props.isEdit && props.employee) {
    emit('submit', { ...employeeData, empNo: props.employee.empNo })
  } else {
    emit('submit', employeeData)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">姓</label>
        <input
          v-model="form.firstName"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">名</label>
        <input
          v-model="form.lastName"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">性别</label>
        <select
          v-model="form.gender"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option :value="1">男</option>
          <option :value="0">女</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">入职日期</label>
        <input
          v-model="form.hireDate"
          type="date"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">生日</label>
        <input
          v-model="form.birthday"
          type="date"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">电话</label>
        <input
          v-model="form.telephone"
          type="tel"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div class="col-span-2">
        <label class="block text-sm font-medium text-gray-700">地址</label>
        <input
          v-model="form.address"
          type="text"
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