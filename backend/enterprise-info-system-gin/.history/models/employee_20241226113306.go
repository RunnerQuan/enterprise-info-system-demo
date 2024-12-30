package models

import (
	"time"
)

type Employee struct {
    EmpNo     int       `gorm:"column:EmpNo;primaryKey;autoIncrement" json:"empNo"`
    FirstName string    `gorm:"column:FirstName;size:30;not null" json:"firstName"`
    LastName  string    `gorm:"column:LastName;size:30;not null" json:"lastName"`
    Gender    int       `gorm:"column:Gender;check:Gender IN (0,1)" json:"gender"`
    HireDate  time.Time `gorm:"column:HireDate;not null" json:"hireDate" time_format:"2006-01-02"`
    Birthday  time.Time `gorm:"column:Birthday" json:"birthday" time_format:"2006-01-02"`
    Address   string    `gorm:"column:Address;size:200" json:"address"`
    Telephone string    `gorm:"column:Telephone;size:20" json:"telephone"`
}

// 自定义日期格式的 JSON 解析
type EmployeeRequest struct {
    FirstName string `json:"firstName"`
    LastName  string `json:"lastName"`
    Gender    int    `json:"gender"`
    HireDate  string `json:"hireDate"`
    Birthday  string `json:"birthday"`
    Address   string `json:"address"`
    Telephone string `json:"telephone"`
}

// 指定表名
func (Employee) TableName() string {
    return "Employees"
} 