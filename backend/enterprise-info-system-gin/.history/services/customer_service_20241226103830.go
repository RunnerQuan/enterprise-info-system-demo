package services

import (
	"enterprise-info-system-gin/models"
	"enterprise-info-system-gin/utils"
)

func GetAllCustomers() ([]models.Customer, error) {
    var customers []models.Customer
    result := utils.DB.Find(&customers)
    return customers, result.Error
}

func CreateCustomer(customer *models.Customer) error {
    return utils.DB.Create(customer).Error
}

func UpdateCustomer(customer *models.Customer) error {
    return utils.DB.Save(customer).Error
}

func DeleteCustomer(id int) error {
    return utils.DB.Delete(&models.Customer{}, id).Error
} 