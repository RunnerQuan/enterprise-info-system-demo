package services

import (
	"errors"
	"time"
	"your-project/models"
	"your-project/utils"

	"gorm.io/gorm"
)

func GetAllDepartments() ([]models.Department, error) {
	var departments []models.Department
	result := utils.DB.Find(&departments)
	return departments, result.Error
}

func CreateDepartment(department *models.Department) error {
	return utils.DB.Create(department).Error
}

func UpdateDepartment(department *models.Department) error {
	return utils.DB.Save(department).Error
}

func DeleteDepartment(id int) error {
	return utils.DB.Transaction(func(tx *gorm.DB) error {
		// 检查是否还有员工在该部门
		var count int64
		if err := tx.Model(&models.EmployeeDepartment{}).
			Where("dept_no = ? AND ed_status = 1", id).
			Count(&count).Error; err != nil {
			return err
		}
		if count > 0 {
			return errors.New("部门中还有员工，无法删除")
		}
		return tx.Delete(&models.Department{}, id).Error
	})
}

// 分配员工到部门
func AssignEmployeeToDepartment(empNo, deptNo int) error {
	return utils.DB.Transaction(func(tx *gorm.DB) error {
		ed := models.EmployeeDepartment{
			EmpNo:       empNo,
			DeptNo:      deptNo,
			EdEntryDate: time.Now(),
			EdStatus:    1,
		}
		
		if err := tx.Create(&ed).Error; err != nil {
			return err
		}

		// 更新部门人数
		return tx.Model(&models.Department{}).
			Where("dept_no = ?", deptNo).
			UpdateColumn("dept_people_count", gorm.Expr("dept_people_count + ?", 1)).
			Error
	})
} 