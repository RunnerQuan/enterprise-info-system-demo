package models

type Customer struct {
	CustomerID   int    `gorm:"primaryKey;autoIncrement" json:"customer_id"`
	CustomerName string `gorm:"size:20;not null" json:"customer_name"`
	Company      string `gorm:"size:50" json:"company"`
	Sex          string `gorm:"size:2" json:"sex"`
	Age          int    `json:"age"`
	Telephone    string `gorm:"size:20" json:"telephone"`
	Address      string `gorm:"size:200" json:"address"`
}