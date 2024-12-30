package routes

import (
	"enterprise-info-system-gin/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// 认证相关路由
	r.POST("/api/login", controllers.Login)
	r.POST("/api/register", controllers.Register)

	// 客户相关路由
	r.GET("/api/customers", controllers.GetCustomers)
	r.POST("/api/customers", controllers.CreateCustomer)
	r.PUT("/api/customers", controllers.UpdateCustomer)
	r.DELETE("/api/customers/:id", controllers.DeleteCustomer)

	// 员工相关路由
	r.GET("/api/employees", controllers.GetEmployees)
	r.POST("/api/employees", controllers.CreateEmployee)
	r.PUT("/api/employees", controllers.UpdateEmployee)
	r.DELETE("/api/employees/:id", controllers.DeleteEmployee)
	r.POST("/api/employees/search", controllers.SearchEmployees)

	// API 路由组
	api := r.Group("/api")
	{
		// 部门相关路由
		api.GET("/departments", controllers.GetDepartments)
		api.POST("/departments", controllers.CreateDepartment)
		api.PUT("/departments/:id", controllers.UpdateDepartment)
		api.DELETE("/departments/:id", controllers.DeleteDepartment)
		api.GET("/departments/stats", controllers.GetDepartmentStats)
		api.GET("/departments/:id/employees", controllers.GetDepartmentEmployees)

		// 员工部门关系管理
		api.GET("/employee-departments", controllers.GetEmployeeDepartments)
		api.POST("/employee-departments", controllers.AddEmployeeDepartment)
		api.PUT("/employee-departments/:id", controllers.UpdateEmployeeDepartment)
		api.DELETE("/employee-departments/:id", controllers.DeleteEmployeeDepartment)
		
		// 添加部门删除相关的路由
		api.DELETE("/departments/:id/employees", controllers.DeleteDepartmentEmployees) // 删除部门及其所有员工关系
	}
} 