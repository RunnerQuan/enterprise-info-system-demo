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

	// 部门相关路由
	r.GET("/api/departments", controllers.GetDepartments)
	r.POST("/api/departments", controllers.CreateDepartment)
	r.PUT("/api/departments", controllers.UpdateDepartment)
	r.DELETE("/api/departments/:id", controllers.DeleteDepartment)

	// 员工部门关系管理
	r.GET("/api/employee-departments", controllers.GetEmployeeDepartments)
	r.POST("/api/employee-departments", controllers.AddEmployeeDepartment)
	r.PUT("/api/employee-departments/:id", controllers.UpdateEmployeeDepartment)
	r.DELETE("/api/employee-departments/:id", controllers.DeleteEmployeeDepartment)
} 