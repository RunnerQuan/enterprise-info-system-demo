export type User = {
  userID: number
  username: string
  role: 'Admin' | 'User'
}

export type Customer = {
  customerID: number
  customerName: string
  company: string
  sex: string
  age: number
  telephone: string
  address: string
}

export type Employee = {
  empNo: number
  firstName: string
  lastName: string
  gender: 0 | 1
  hireDate: string
  birthday: string
  address: string
  telephone: string
}

export type Department = {
  deptNo: number
  deptName: string
  deptPeopleCount: number
}

export type EmployeeDepartment = {
  edID: number
  empNo: number
  deptNo: number
  edEntryDate: string
  edLeaveDate: string | null
  edStatus: 1 | 2  // 1: 隶属部门, 2: 离开部门
}

// 扩展类型，用于显示
export type EmployeeDepartmentDetail = EmployeeDepartment & {
  employeeName: string  // 员工姓名（firstName + lastName）
  departmentName: string  // 部门名称
} 