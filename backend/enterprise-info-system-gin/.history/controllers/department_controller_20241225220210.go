package controllers

import (
	"net/http"
	"strconv"
	"your-project/models"
	"your-project/services"

	"github.com/gin-gonic/gin"
)

func GetDepartments(c *gin.Context) {
	departments, err := services.GetAllDepartments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取部门列表失败"})
		return
	}
	c.JSON(http.StatusOK, departments)
}

func CreateDepartment(c *gin.Context) {
	var department models.Department
	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	if err := services.CreateDepartment(&department); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建部门失败"})
		return
	}

	c.JSON(http.StatusOK, department)
}

func UpdateDepartment(c *gin.Context) {
	var department models.Department
	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
		return
	}

	if err := services.UpdateDepartment(&department); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新部门失败"})
		return
	}

	c.JSON(http.StatusOK, department)
}

func DeleteDepartment(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的ID"})
		return
	}

	if err := services.DeleteDepartment(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除部门失败"})
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