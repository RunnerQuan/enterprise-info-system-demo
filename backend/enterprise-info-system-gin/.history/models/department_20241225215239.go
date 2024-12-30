package models

import "time"

type Department struct {
    DeptNo          int    `gorm:"primaryKey;autoIncrement" json:"dept_no"`
    DeptName        string `gorm:"size:30;not null" json:"dept_name"`
    DeptPeopleCount int    `gorm:"default:0" json:"dept_people_count"`
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