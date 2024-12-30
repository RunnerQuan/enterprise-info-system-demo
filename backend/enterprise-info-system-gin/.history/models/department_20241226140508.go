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

// 指定表名
func (Department) TableName() string {
    return "Departments"
}

type EmployeeDepartment struct {
    EdID        int       `gorm:"primaryKey;autoIncrement" json:"ed_id"`
    EmpNo       int       `gorm:"not null" json:"emp_no"`
    DeptNo      int       `gorm:"not null" json:"dept_no"`
    EdEntryDate time.Time `gorm:"not null" json:"ed_entry_date"`
    EdLeaveDate time.Time `json:"ed_leave_date"`
    EdStatus    int       `gorm:"check:ed_status IN (1,2)" json:"ed_status"`
    Employee    Employee  `gorm:"foreignKey:EmpNo" json:"employee"`
    Department  Department`gorm:"foreignKey:DeptNo" json:"department"`
} 