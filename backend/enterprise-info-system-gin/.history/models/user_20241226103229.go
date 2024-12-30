package models

type User struct {
	UserID       int    `gorm:"column:UserID;primaryKey;autoIncrement" json:"user_id"`
	Username     string `gorm:"column:Username;size:50;not null;unique" json:"username"`
	PasswordHash string `gorm:"column:PasswordHash;size:255;not null" json:"password_hash"`
	Role         string `gorm:"column:Role;size:20;default:User" json:"role"`
}

// 指定表名
func (User) TableName() string {
	return "Users"
}