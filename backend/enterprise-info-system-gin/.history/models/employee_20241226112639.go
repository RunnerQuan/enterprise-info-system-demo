package models

import "time"

type Employee struct {
    EmpNo     int       `gorm:"column:EmpNo;primaryKey;autoIncrement" json:"empNo"`
    FirstName string    `gorm:"column:FirstName;size:30;not null" json:"firstName"`
    LastName  string    `gorm:"column:LastName;size:30;not null" json:"lastName"`
    Gender    int       `gorm:"column:Gender;check:Gender IN (0,1)" json:"gender"`
    HireDate  time.Time `gorm:"column:HireDate;not null" json:"hireDate"`
    Birthday  time.Time `gorm:"column:Birthday" json:"birthday"`
    Address   string    `gorm:"column:Address;size:200" json:"address"`
    Telephone string    `gorm:"column:Telephone;size:20" json:"telephone"`
}

// 指定表名
func (Employee) TableName() string {
    return "Employees"
} 