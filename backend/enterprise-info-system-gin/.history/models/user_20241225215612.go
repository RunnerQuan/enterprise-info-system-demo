package models

type User struct {
	UserID       int    `gorm:"primaryKey;autoIncrement" json:"user_id"`
	Username     string `gorm:"size:50;not null;unique" json:"username"`
	PasswordHash string `gorm:"size:255;not null" json:"-"`
	Role         string `gorm:"size:20;default:User" json:"role"`
}