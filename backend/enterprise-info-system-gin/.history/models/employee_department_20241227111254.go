package models

import "time"

// 员工部门关系模型
type EmployeeDepartment struct {
    EdID        int        `gorm:"column:EdID;primaryKey;autoIncrement" json:"edId"`
    EmpNo       int        `gorm:"column:EmpNo;not null;index:idx_emp_dept" json:"empNo"`
    DeptNo      int        `gorm:"column:DeptNo;not null;index:idx_emp_dept" json:"deptNo"`
    EdEntryDate time.Time  `gorm:"column:EdEntryDate;not null" json:"edEntryDate"`
    EdLeaveDate *time.Time `gorm:"column:EdLeaveDate" json:"edLeaveDate"`
    EdStatus    int        `gorm:"column:EdStatus;check:EdStatus IN (1,2)" json:"edStatus"`
    
    // 关联关系
    Employee   Employee   `gorm:"foreignKey:EmpNo;references:EmpNo" json:"employee,omitempty"`
    Department Department `gorm:"foreignKey:DeptNo;references:DeptNo" json:"department,omitempty"`
}

// 用于接收添加/更新关系的请求
type EmployeeDepartmentRequest struct {
    EmpNo       int    `json:"empNo"`
    DeptNo      int    `json:"deptNo"`
    EdEntryDate string `json:"edEntryDate"`
    EdLeaveDate string `json:"edLeaveDate,omitempty"`
    EdStatus    int    `json:"edStatus"`
}

// 用于返回分组后的员工部门关系
type GroupedEmployeeDepartment struct {
    EmpNo           int                 `json:"empNo"`
    EmployeeName    string              `json:"employeeName"`
    DepartmentCount int                 `json:"departmentCount"`
    Departments     []DepartmentRelation `json:"departments"`
}

// 部门关系详情
type DepartmentRelation struct {
    EdID           int        `json:"edID"`
    DeptNo         int        `json:"deptNo"`
    DepartmentName string     `json:"departmentName"`
    EdEntryDate    time.Time  `json:"edEntryDate"`
    EdLeaveDate    *time.Time `json:"edLeaveDate"`
    EdStatus       int        `json:"edStatus"`
}

// 指定表名
func (EmployeeDepartment) TableName() string {
    return "Employee_Department"
} 