<script setup lang="ts">
import { ref } from 'vue'
import type { Customer } from '@/types'

const props = defineProps<{
  customer?: Customer
  isEdit?: boolean
}>()

const emit = defineEmits<{
  submit: [customer: Omit<Customer, 'customerID'> | Customer]
  cancel: []
}>()

const form = ref({
  customerName: props.customer?.customerName ?? '',
  company: props.customer?.company ?? '',
  sex: props.customer?.sex ?? '男',
  age: props.customer?.age ?? 18,
  telephone: props.customer?.telephone ?? '',
  address: props.customer?.address ?? ''
})

const handleSubmit = () => {
  const customerData = {
    ...form.value,
    age: Number(form.value.age)
  }
  
  if (props.isEdit && props.customer) {
    emit('submit', { ...customerData, customerID: props.customer.customerID })
  } else {
    emit('submit', customerData)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">客户姓名</label>
        <input
          v-model="form.customerName"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">公司</label>
        <input
          v-model="form.company"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">性别</label>
        <select
          v-model="form.sex"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">年龄</label>
        <input
          v-model.number="form.age"
          type="number"
          min="1"
          max="150"
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
      <div>
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