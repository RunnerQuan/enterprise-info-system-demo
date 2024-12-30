package controllers

import (
	"enterprise-info-system-gin/models"
	"enterprise-info-system-gin/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// 获取所有部门
func GetDepartments(c *gin.Context) {
	departments, err := services.GetAllDepartments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取部门列表失败"})
		return
	}
	c.JSON(http.StatusOK, departments)
}

// 创建部门
func CreateDepartment(c *gin.Context) {
	var req models.DepartmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	department := &models.Department{
		DeptName:        req.DeptName,
		DeptPeopleCount: req.DeptPeopleCount,
	}

	newDepartment, err := services.CreateDepartment(department)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, newDepartment)
}

// 更新部门
func UpdateDepartment(c *gin.Context) {
	var req models.DepartmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	department := &models.Department{
		DeptNo:          req.DeptNo,
		DeptName:        req.DeptName,
		DeptPeopleCount: req.DeptPeopleCount,
	}

	if err := services.UpdateDepartment(department); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, department)
}

// 删除部门
func DeleteDepartment(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的ID"})
		return
	}

	if err := services.DeleteDepartment(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

func AssignEmployeeToDepartment(c *gin.Context) {
	var req struct {
		EmpNo  int `json:"emp_no"`
		DeptNo int `json:"dept_no"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	if err := services.AssignEmployeeToDepartment(req.EmpNo, req.DeptNo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "分配部门失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "分配成功"})
}

// 获取部门统计信息
func GetDepartmentStats(c *gin.Context) {
	stats, err := services.GetDepartmentEmployeeStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取部门统计信息失败"})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// 获取部门员工列表
func GetDepartmentEmployees(c *gin.Context) {
	deptNo, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的部门ID"})
		return
	}

	employees, err := services.GetEmployeesInDepartment(deptNo)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取部门员工列表失败"})
		return
	}
	c.JSON(http.StatusOK, employees)
}

// 删除部门及其所有员工关系
func DeleteDepartmentEmployees(c *gin.Context) {
	deptNo, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的部门ID"})
		return
	}

	if err := services.DeleteDepartment(deptNo); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
} 