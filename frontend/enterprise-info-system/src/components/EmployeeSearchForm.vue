<script setup lang="ts">
import { ref } from 'vue'
import { useDepartmentStore } from '@/stores/department'

const departmentStore = useDepartmentStore()

const searchForm = ref({
  name: '',
  department: '',
  hireDateStart: '',
  hireDateEnd: '',
})

const emit = defineEmits<{
  search: [searchParams: typeof searchForm.value]
  reset: []
}>()

const handleSubmit = () => {
  emit('search', searchForm.value)
}

const handleReset = () => {
  searchForm.value = {
    name: '',
    department: '',
    hireDateStart: '',
    hireDateEnd: '',
  }
  emit('reset')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">员工姓名</label>
        <input
          v-model="searchForm.name"
          type="text"
          placeholder="请输入姓名"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">所属部门</label>
        <select
          v-model="searchForm.department"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">全部部门</option>
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
        <label class="block text-sm font-medium text-gray-700">入职日期起</label>
        <input
          v-model="searchForm.hireDateStart"
          type="date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">入职日期止</label>
        <input
          v-model="searchForm.hireDateEnd"
          type="date"
          :min="searchForm.hireDateStart"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
    <div class="mt-4 flex justify-end space-x-3">
      <button
        type="button"
        @click="handleReset"
        class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        重置
      </button>
      <button
        type="submit"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        搜索
      </button>
    </div>
  </form>
</template> 