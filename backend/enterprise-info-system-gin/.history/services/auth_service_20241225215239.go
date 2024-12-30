package services

import (
	"errors"
	"your-project/models"
	"your-project/utils"

	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

func Login(req LoginRequest) (*models.User, error) {
    var user models.User
    result := utils.DB.Where("username = ?", req.Username).First(&user)
    if result.Error != nil {
        return nil, errors.New("用户名不存在")
    }

    err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
    if err != nil {
        return nil, errors.New("密码错误")
    }

    return &user, nil
} 