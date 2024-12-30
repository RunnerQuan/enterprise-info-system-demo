package controllers

import (
	"enterprise-info-system-gin/models"
	"enterprise-info-system-gin/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// 获取所有员工部门关系
func GetEmployeeDepartments(c *gin.Context) {
    relations, err := services.GetGroupedEmployeeDepartments()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "获取员工部门关系失败"})
        return
    }
    c.JSON(http.StatusOK, relations)
}

// 添加员工部门关系
func AddEmployeeDepartment(c *gin.Context) {
    var req models.EmployeeDepartmentRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
        return
    }

    if err := services.AddEmployeeDepartment(&req); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "添加成功"})
}

// 更新员工部门关系
func UpdateEmployeeDepartment(c *gin.Context) {
    edID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的ID"})
        return
    }

    var req models.EmployeeDepartmentRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求参数"})
        return
    }

    if err := services.UpdateEmployeeDepartment(edID, &req); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "更新成功"})
}

// 删除员工部门关系
func DeleteEmployeeDepartment(c *gin.Context) {
    edID, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "无效的ID"})
        return
    }

    if err := services.DeleteEmployeeDepartment(edID); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "删除成功"})
} 