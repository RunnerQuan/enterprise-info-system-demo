package models

type Department struct {
	DeptNo          int    `gorm:"column:DeptNo;primaryKey;autoIncrement" json:"deptNo"`
	DeptName        string `gorm:"column:DeptName;size:30;not null;index:idx_department_name" json:"deptName"`
	DeptPeopleCount int    `gorm:"column:DeptPeopleCount;default:0" json:"deptPeopleCount"`
}

// 用于接收请求的结构体
type DepartmentRequest struct {
	DeptNo          int    `json:"deptNo"`
	DeptName        string `json:"deptName"`
	DeptPeopleCount int    `json:"deptPeopleCount"`
}

// 部门统计信息
type DepartmentStats struct {
	DeptNo        int    `json:"deptNo"`
	DeptName      string `json:"deptName"`
	EmployeeCount int    `json:"employeeCount"`
}

// 指定表名
func (Department) TableName() string {
	return "Departments"
}