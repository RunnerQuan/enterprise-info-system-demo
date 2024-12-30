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
    EdID        int       `gorm:"column:EdID;primaryKey;autoIncrement" json:"edId"`
    EmpNo       int       `gorm:"column:EmpNo;not null;index" json:"empNo"`
    DeptNo      int       `gorm:"column:DeptNo;not null;index" json:"deptNo"`
    EdEntryDate time.Time `gorm:"column:EdEntryDate;not null" json:"edEntryDate"`
    EdLeaveDate time.Time `gorm:"column:EdLeaveDate" json:"edLeaveDate"`
    EdStatus    int       `gorm:"column:EdStatus;check:EdStatus IN (1,2)" json:"edStatus"`
    Employee    Employee  `gorm:"foreignKey:EmpNo;references:EmpNo" json:"employee"`
    Department  Department`gorm:"foreignKey:DeptNo;references:DeptNo" json:"department"`
}

// 指定表名
func (Department) TableName() string {
    return "Departments"
}

// 指定 EmployeeDepartment 表名
func (EmployeeDepartment) TableName() string {
    return "Employee_Department"
} 