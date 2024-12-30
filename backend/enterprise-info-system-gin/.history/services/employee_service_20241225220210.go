package services

import (
	"time"
	"your-project/models"
	"your-project/utils"

	"gorm.io/gorm"
)

func GetAllEmployees() ([]models.Employee, error) {
	var employees []models.Employee
	result := utils.DB.Find(&employees)
	return employees, result.Error
}

func CreateEmployee(employee *models.Employee) error {
	return utils.DB.Create(employee).Error
}

func UpdateEmployee(employee *models.Employee) error {
	return utils.DB.Save(employee).Error
}

func DeleteEmployee(id int) error {
	return utils.DB.Transaction(func(tx *gorm.DB) error {
		// 首先更新相关部门的人数
		if err := tx.Model(&models.EmployeeDepartment{}).
			Where("emp_no = ? AND ed_status = 1", id).
			Update("ed_status", 2).
			Update("ed_leave_date", time.Now()).Error; err != nil {
			return err
		}
		
		// 然后删除员工
		return tx.Delete(&models.Employee{}, id).Error
	})
}

// 多条件查询员工
func SearchEmployees(params map[string]interface{}) ([]models.Employee, error) {
	var employees []models.Employee
	query := utils.DB.Model(&models.Employee{})

	if name, ok := params["name"].(string); ok && name != "" {
		query = query.Where("first_name LIKE ? OR last_name LIKE ?", "%"+name+"%", "%"+name+"%")
	}

	if startDate, ok := params["start_date"].(string); ok && startDate != "" {
		query = query.Where("hire_date >= ?", startDate)
	}

	if endDate, ok := params["end_date"].(string); ok && endDate != "" {
		query = query.Where("hire_date <= ?", endDate)
	}

	result := query.Find(&employees)
	return employees, result.Error
} 