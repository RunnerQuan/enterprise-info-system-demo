package models

import "time"

type Employee struct {
    EmpNo     int       `gorm:"primaryKey;autoIncrement" json:"emp_no"`
    FirstName string    `gorm:"size:30;not null" json:"first_name"`
    LastName  string    `gorm:"size:30;not null" json:"last_name"`
    Gender    int       `gorm:"check:gender IN (0,1)" json:"gender"`
    HireDate  time.Time `gorm:"not null" json:"hire_date"`
    Birthday  time.Time `json:"birthday"`
    Address   string    `gorm:"size:200" json:"address"`
    Telephone string    `gorm:"size:20" json:"telephone"`
} 