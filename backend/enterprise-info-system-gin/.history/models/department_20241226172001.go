package models

import "time"

type Department struct {
    DeptNo          int    `gorm:"column:DeptNo;primaryKey;autoIncrement" json:"deptNo"`
    DeptName        string `gorm:"column:DeptName;size:30;not null" json:"deptName"`
    DeptPeopleCount int    `gorm:"column:DeptPeopleCount;default:0" json:"deptPeopleCount"`
}

// 用于接收请求的结构体
type DepartmentRequest struct {
    DeptNo          int    `json:"deptNo"`
    DeptName        string `json:"deptName"`
    DeptPeopleCount int    `json:"deptPeopleCount"`
}

type EmployeeDepartment struct {
    EdID        int        `gorm:"column:EdID;primaryKey;autoIncrement" json:"edId"`
    EmpNo       int        `gorm:"column:EmpNo;not null" json:"empNo"`
    DeptNo      int        `gorm:"column:DeptNo;not null" json:"deptNo"`
    EdEntryDate time.Time  `gorm:"column:EdEntryDate;not null" json:"edEntryDate"`
    EdLeaveDate *time.Time `gorm:"column:EdLeaveDate" json:"edLeaveDate"`
    EdStatus    int        `gorm:"column:EdStatus;check:EdStatus IN (1,2)" json:"edStatus"`
}

// 指定表名
func (Department) TableName() string {
    return "Departments"
}

// 指定 EmployeeDepartment 表名
func (EmployeeDepartment) TableName() string {
    return "Employee_Department"
}

// 用于返回分组后的员工部门关系
type GroupedEmployeeDepartment struct {
    EmpNo       int    `json:"empNo"`
    EmployeeName string `json:"employeeName"`
    Departments []DepartmentRelation `json:"departments"`
}

type DepartmentRelation struct {
    EdID          int       `json:"edID"`
    DeptNo        int       `json:"deptNo"`
    DepartmentName string   `json:"departmentName"`
    EdEntryDate   time.Time `json:"edEntryDate"`
    EdLeaveDate   *time.Time `json:"edLeaveDate"`
    EdStatus      int       `json:"edStatus"`
}

// 用于接收添加/更新关系的请求
type EmployeeDepartmentRequest struct {
    EmpNo       int       `json:"empNo"`
    DeptNo      int       `json:"deptNo"`
    EdEntryDate string    `json:"edEntryDate"`
    EdLeaveDate string    `json:"edLeaveDate,omitempty"`
    EdStatus    int       `json:"edStatus"`
} 