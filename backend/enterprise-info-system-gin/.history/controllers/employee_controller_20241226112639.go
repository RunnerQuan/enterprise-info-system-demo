package controllers

import (
	"enterprise-info-system-gin/models"
	"enterprise-info-system-gin/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// 获取所有员工
func GetEmployees(c *gin.Context) {
	employees, err := services.GetAllEmployees()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取员工列表失败"})
		return
	}
	c.JSON(http.StatusOK, employees)
}

// 创建员工
func CreateEmployee(c *gin.Context) {
	var employee models.Employee
	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	newEmployee, err := services.CreateEmployee(&employee)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, newEmployee)
}

// 更新员工
func UpdateEmployee(c *gin.Context) {
	var employee models.Employee
	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	if err := services.UpdateEmployee(&employee); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, employee)
}

// 删除员工
func DeleteEmployee(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的ID"})
		return
	}

	if err := services.DeleteEmployee(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
}

// 搜索员工
func SearchEmployees(c *gin.Context) {
	var params map[string]interface{}
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	employees, err := services.SearchEmployees(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "搜索员工失败"})
		return
	}

	c.JSON(http.StatusOK, employees)
} 