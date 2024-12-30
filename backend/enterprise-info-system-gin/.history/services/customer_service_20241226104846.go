package services

import (
	"enterprise-info-system-gin/models"
	"enterprise-info-system-gin/utils"
	"errors"
)

// 获取所有客户
func GetAllCustomers() ([]models.Customer, error) {
	var customers []models.Customer
	result := utils.DB.Find(&customers)
	return customers, result.Error
}

// 添加客户
func CreateCustomer(customer *models.Customer) (*models.Customer, error) {
	if customer.CustomerName == "" {
		return nil, errors.New("客户名称不能为空")
	}
	
	result := utils.DB.Create(customer)
	if result.Error != nil {
		return nil, errors.New("创建客户失败")
	}
	
	return customer, nil
}

// 更新客户
func UpdateCustomer(customer *models.Customer) error {
	if customer.CustomerID == 0 {
		return errors.New("客户ID不能为空")
	}
	
	// 检查客户是否存在
	var existingCustomer models.Customer
	if err := utils.DB.First(&existingCustomer, customer.CustomerID).Error; err != nil {
		return errors.New("客户不存在")
	}
	
	result := utils.DB.Save(customer)
	if result.Error != nil {
		return errors.New("更新客户失败")
	}
	
	return nil
}

// 删除客户
func DeleteCustomer(id int) error {
	if id == 0 {
		return errors.New("客户ID不能为空")
	}
	
	// 检查客户是否存在
	var existingCustomer models.Customer
	if err := utils.DB.First(&existingCustomer, id).Error; err != nil {
		return errors.New("客户不存在")
	}
	
	result := utils.DB.Delete(&models.Customer{}, id)
	if result.Error != nil {
		return errors.New("删除客户失败")
	}
	
	return nil
} 