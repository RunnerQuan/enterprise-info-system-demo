package models

type Customer struct {
	CustomerID   int    `gorm:"column:CustomerID;primaryKey;autoIncrement" json:"customerID"`
	CustomerName string `gorm:"column:CustomerName;size:20;not null" json:"customerName"`
	Company      string `gorm:"column:Company;size:50" json:"company"`
	Sex          string `gorm:"column:Sex;size:2" json:"sex"`
	Age          int    `gorm:"column:Age" json:"age"`
	Telephone    string `gorm:"column:Telephone;size:20" json:"telephone"`
	Address      string `gorm:"column:Address;size:200" json:"address"`
}

// 指定表名
func (Customer) TableName() string {
	return "Customers"
}