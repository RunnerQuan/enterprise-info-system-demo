package routes

import (
	"enterprise-info-system-gin/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	// API 路由组
	api := r.Group("/api")
	{
		// 认证相关路由
		api.POST("/login", controllers.Login)
		api.POST("/register", controllers.Register)

		// 客户相关路由
		api.GET("/customers", controllers.GetCustomers)
		api.POST("/customers", controllers.CreateCustomer)
		api.PUT("/customers/:id", controllers.UpdateCustomer)
		api.DELETE("/customers/:id", controllers.DeleteCustomer)

		// 员工相关路由
		api.GET("/employees", controllers.GetEmployees)
		api.POST("/employees", controllers.CreateEmployee)
		api.PUT("/employees/:id", controllers.UpdateEmployee)
		api.DELETE("/employees/:id", controllers.DeleteEmployee)
		api.POST("/employees/search", controllers.SearchEmployees)

		// 部门相关路由
		api.GET("/departments", controllers.GetDepartments)
		api.POST("/departments", controllers.CreateDepartment)
		api.PUT("/departments/:id", controllers.UpdateDepartment)
		api.DELETE("/departments/:id", controllers.DeleteDepartment)

		// 员工部门关系管理
		api.GET("/employee-departments", controllers.GetEmployeeDepartments)
		api.POST("/employee-departments", controllers.AddEmployeeDepartment)
		api.PUT("/employee-departments/:id", controllers.UpdateEmployeeDepartment)
		api.DELETE("/employee-departments/:id", controllers.DeleteEmployeeDepartment)
	}
} 