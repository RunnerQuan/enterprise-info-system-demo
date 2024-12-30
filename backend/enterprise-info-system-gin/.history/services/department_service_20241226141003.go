package services

import (
	"enterprise-info-system-gin/models"
	"enterprise-info-system-gin/utils"
	"errors"
	"log"
	"time"

	"gorm.io/gorm"
)

// 获取所有部门
func GetAllDepartments() ([]models.Department, error) {
	var departments []models.Department
	result := utils.DB.Find(&departments)
	return departments, result.Error
}

// 添加部门
func CreateDepartment(department *models.Department) (*models.Department, error) {
	if department.DeptName == "" {
		return nil, errors.New("部门名称不能为空")
	}

	// 检查部门名称是否已存在
	var existingDept models.Department
	if err := utils.DB.Where("DeptName = ?", department.DeptName).First(&existingDept).Error; err == nil {
		return nil, errors.New("部门名称已存在")
	}

	// 添加日志
	log.Printf("Creating department: %+v\n", department)

	result := utils.DB.Create(department)
	if result.Error != nil {
		// 添加错误日志
		log.Printf("Error creating department: %v\n", result.Error)
		return nil, errors.New("创建部门失败")
	}

	return department, nil
}

// 更新部门
func UpdateDepartment(department *models.Department) error {
	if department.DeptNo == 0 {
		return errors.New("部门ID不能为空")
	}

	// 检查部门是否存在
	var existingDept models.Department
	if err := utils.DB.First(&existingDept, department.DeptNo).Error; err != nil {
		return errors.New("部门不存在")
	}

	// 检查新的部门名称是否与其他部门重复
	if department.DeptName != existingDept.DeptName {
		var duplicateDept models.Department
		if err := utils.DB.Where("DeptName = ? AND DeptNo != ?", department.DeptName, department.DeptNo).
			First(&duplicateDept).Error; err == nil {
			return errors.New("部门名称已存在")
		}
	}

	result := utils.DB.Save(department)
	if result.Error != nil {
		return errors.New("更新部门失败")
	}

	return nil
}

// 删除部门
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

		// 删除部门
		if err := tx.Delete(&models.Department{}, id).Error; err != nil {
			return errors.New("删除部门失败")
		}

		return nil
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