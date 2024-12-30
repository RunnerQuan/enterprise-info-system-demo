package services

import (
	"enterprise-info-system-gin/models"
	"enterprise-info-system-gin/utils"
	"errors"
	"time"

	"gorm.io/gorm"
)

// 获取所有员工
func GetAllEmployees() ([]models.Employee, error) {
	var employees []models.Employee
	result := utils.DB.Find(&employees)
	return employees, result.Error
}

// 添加员工
func CreateEmployee(employee *models.Employee) (*models.Employee, error) {
	if employee.FirstName == "" || employee.LastName == "" {
		return nil, errors.New("员工姓名不能为空")
	}

	// 设置默认值
	if employee.HireDate.IsZero() {
		employee.HireDate = time.Now()
	}

	result := utils.DB.Create(employee)
	if result.Error != nil {
		return nil, errors.New("创建员工失败")
	}

	return employee, nil
}

// 更新员工
func UpdateEmployee(employee *models.Employee) error {
	if employee.EmpNo == 0 {
		return errors.New("员工ID不能为空")
	}

	// 检查员工是否存在
	var existingEmployee models.Employee
	if err := utils.DB.First(&existingEmployee, employee.EmpNo).Error; err != nil {
		return errors.New("员工不存在")
	}

	result := utils.DB.Save(employee)
	if result.Error != nil {
		return errors.New("更新员工失败")
	}

	return nil
}

// 删除员工
func DeleteEmployee(id int) error {
	return utils.DB.Transaction(func(tx *gorm.DB) error {
		// 首先删除员工的所有部门关系（触发器会自动更新部门人数）
		if err := tx.Where("EmpNo = ?", id).Delete(&models.EmployeeDepartment{}).Error; err != nil {
			return errors.New("删除员工部门关系失败")
		}

		// 然后删除员工
		if err := tx.Delete(&models.Employee{}, id).Error; err != nil {
			return errors.New("删除员工失败")
		}

		return nil
	})
}

// 搜索员工
func SearchEmployees(params map[string]interface{}) ([]models.Employee, error) {
	var employees []models.Employee
	query := utils.DB.Model(&models.Employee{})

	// 姓名搜索（支持姓、名、全名搜索）
	if name, ok := params["name"].(string); ok && name != "" {
		query = query.Where(
			"FirstName LIKE ? OR LastName LIKE ? OR CONCAT(LastName, FirstName) LIKE ?",
			"%"+name+"%", "%"+name+"%", "%"+name+"%",
		)
	}

	// 入职日期范围搜索
	if startDate, ok := params["hireDateStart"].(string); ok && startDate != "" {
		query = query.Where("DATE(HireDate) >= ?", startDate)
	}
	if endDate, ok := params["hireDateEnd"].(string); ok && endDate != "" {
		query = query.Where("DATE(HireDate) <= ?", endDate)
	}

	// 部门搜索
	if deptNo, ok := params["department"].(string); ok && deptNo != "" && deptNo != "0" {
		query = query.Joins(`
			JOIN Employee_Department ed ON Employees.EmpNo = ed.EmpNo 
			AND ed.EdStatus = 1 
			AND ed.DeptNo = ?
		`, deptNo)
	}

	// 执行查询
	err := query.Find(&employees).Error
	if err != nil {
		return nil, errors.New("查询员工信息失败")
	}

	return employees, nil
}

// 获取员工详细信息（包括部门信息）
func GetEmployeeDetail(empNo int) (*models.EmployeeDetail, error) {
	var employee models.Employee
	if err := utils.DB.First(&employee, empNo).Error; err != nil {
		return nil, errors.New("员工不存在")
	}

	// 获取员工的部门信息
	var departments []models.DepartmentInfo
	err := utils.DB.Raw(`
		SELECT d.DeptNo, d.DeptName, ed.EdEntryDate, ed.EdStatus
		FROM Employee_Department ed
		JOIN Departments d ON ed.DeptNo = d.DeptNo
		WHERE ed.EmpNo = ?
		ORDER BY ed.EdEntryDate DESC
	`, empNo).Scan(&departments).Error

	if err != nil {
		return nil, errors.New("获取部门信息失败")
	}

	return &models.EmployeeDetail{
		Employee:    employee,
		Departments: departments,
	}, nil
} 