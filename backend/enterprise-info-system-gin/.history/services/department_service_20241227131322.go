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
		// 首先获取部门信息
		var dept models.Department
		if err := tx.First(&dept, id).Error; err != nil {
			return errors.New("部门不存在")
		}

		// 删除部门的所有员工关系
		if err := tx.Where("DeptNo = ?", id).Delete(&models.EmployeeDepartment{}).Error; err != nil {
			return errors.New("删除部门关系失败")
		}

		// 最后删除部门
		if err := tx.Delete(&dept).Error; err != nil {
			return errors.New("删除部门失败")
		}

		return nil
	})
}

// 分配员工部门
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
			Where("DeptNo = ?", deptNo).
			UpdateColumn("DeptPeopleCount", gorm.Expr("DeptPeopleCount + ?", 1)).
			Error
	})
}

// 获取所有员工部门关系（按员工分组）
func GetGroupedEmployeeDepartments() ([]models.GroupedEmployeeDepartment, error) {
	var result []models.GroupedEmployeeDepartment

	// 修改查询语句，移除错误的 USE INDEX 语法
	rows, err := utils.DB.Raw(`
		SELECT DISTINCT e.EmpNo, CONCAT(e.FirstName, ' ', e.LastName) as EmployeeName
		FROM Employees e
		INNER JOIN Employee_Department ed 
		FORCE INDEX (idx_emp_dept)
		ON e.EmpNo = ed.EmpNo
	`).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var grouped models.GroupedEmployeeDepartment
		rows.Scan(&grouped.EmpNo, &grouped.EmployeeName)

		// 获取该员工的所有部门关系
		var relations []models.DepartmentRelation
		err := utils.DB.Raw(`
			SELECT ed.EdID, ed.DeptNo, d.DeptName as DepartmentName, 
				   ed.EdEntryDate, ed.EdLeaveDate, ed.EdStatus
			FROM Employee_Department ed
			FORCE INDEX (idx_emp_dept)
			INNER JOIN Departments d ON ed.DeptNo = d.DeptNo
			WHERE ed.EmpNo = ?
			ORDER BY ed.EdEntryDate DESC
		`, grouped.EmpNo).Scan(&relations).Error
		if err != nil {
			return nil, err
		}

		grouped.Departments = relations
		result = append(result, grouped)
	}

	return result, nil
}

// 添加员工部门关系
func AddEmployeeDepartment(req *models.EmployeeDepartmentRequest) error {
	return utils.DB.Transaction(func(tx *gorm.DB) error {
		// 验证员工和部门是否存在
		var emp models.Employee
		if err := tx.First(&emp, req.EmpNo).Error; err != nil {
			return errors.New("员工不存在")
		}

		var dept models.Department
		if err := tx.First(&dept, req.DeptNo).Error; err != nil {
			return errors.New("部门不存在")
		}

		// 检查是否已存在有效的部门关系
		var existingEd models.EmployeeDepartment
		if err := tx.Where("EmpNo = ? AND DeptNo = ? AND EdStatus = 1", req.EmpNo, req.DeptNo).
			First(&existingEd).Error; err == nil {
			return errors.New("该员工已在此部门中")
		}

		// 解析日期
		entryDate, err := time.Parse("2006-01-02", req.EdEntryDate)
		if err != nil {
			return errors.New("无效的入职日期格式")
		}

		ed := models.EmployeeDepartment{
			EmpNo:       req.EmpNo,
			DeptNo:      req.DeptNo,
			EdEntryDate: entryDate,
			EdStatus:    req.EdStatus, // 使用请求中的状态
		}

		// 如果有离职日期，则解析
		if req.EdLeaveDate != "" && req.EdLeaveDate != "null" {
			leaveDate, err := time.Parse("2006-01-02", req.EdLeaveDate)
			if err != nil {
				return errors.New("无效的离职日期格式")
			}
			ed.EdLeaveDate = &leaveDate
		}

		// 创建关系
		if err := tx.Create(&ed).Error; err != nil {
			return errors.New("创建部门关系失败")
		}

		// 如果是在职状态，更新部门人数
		if ed.EdStatus == 1 {
			if err := tx.Model(&models.Department{}).
				Where("DeptNo = ?", req.DeptNo).
				UpdateColumn("DeptPeopleCount", gorm.Expr("DeptPeopleCount + ?", 1)).
				Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// 更新员工部门关系
func UpdateEmployeeDepartment(edID int, req *models.EmployeeDepartmentRequest) error {
	return utils.DB.Transaction(func(tx *gorm.DB) error {
		var ed models.EmployeeDepartment
		if err := tx.First(&ed, edID).Error; err != nil {
			return errors.New("部门关系不存在")
		}

		// 解析日期
		entryDate, err := time.Parse("2006-01-02", req.EdEntryDate)
		if err != nil {
			return errors.New("无效的入职日期格式")
		}

		var leaveDate *time.Time
		if req.EdLeaveDate != "" {
			parsedLeaveDate, err := time.Parse("2006-01-02", req.EdLeaveDate)
			if err != nil {
				return errors.New("无效的离职日期格式")
			}
			leaveDate = &parsedLeaveDate
		}

		// 更新关系（触发器会自动更新部门人数）
		ed.EdEntryDate = entryDate
		ed.EdLeaveDate = leaveDate
		ed.EdStatus = req.EdStatus

		return tx.Save(&ed).Error
	})
}

// 删除员工部门关系
func DeleteEmployeeDepartment(edID int) error {
	return utils.DB.Transaction(func(tx *gorm.DB) error {
		var ed models.EmployeeDepartment
		if err := tx.First(&ed, edID).Error; err != nil {
			return errors.New("部门关系不存在")
		}

		// 如果是在职状态，需要更新部门人数
		if ed.EdStatus == 1 {
			if err := tx.Model(&models.Department{}).
				Where("DeptNo = ?", ed.DeptNo).
				UpdateColumn("DeptPeopleCount", gorm.Expr("DeptPeopleCount - ?", 1)).
				Error; err != nil {
				return err
			}
		}

		return tx.Delete(&ed).Error
	})
}

// 获取部门员工统计
func GetDepartmentEmployeeStats() ([]models.DepartmentStats, error) {
	var stats []models.DepartmentStats
	err := utils.DB.Raw("CALL CountEmployeesInAllDepartments()").Scan(&stats).Error
	return stats, err
}

// 获取部门内所有员工
func GetEmployeesInDepartment(deptNo int) ([]models.Employee, error) {
	var employees []models.Employee
	err := utils.DB.Raw("CALL GetEmployeesByDepartment(?)", deptNo).Scan(&employees).Error
	return employees, err
} 