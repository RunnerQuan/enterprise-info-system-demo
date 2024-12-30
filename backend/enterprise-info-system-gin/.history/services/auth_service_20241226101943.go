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

type RegisterRequest struct {
    Username string `json:"username"`
    Password string `json:"password"`
    Role     string `json:"role"`
}

func Register(req RegisterRequest) (*models.User, error) {
    // 检查用户名是否已存在
    var existingUser models.User
    result := utils.DB.Where("username = ?", req.Username).First(&existingUser)
    if result.Error == nil {
        return nil, errors.New("用户名已存在")
    }

    // 设置默认角色
    if req.Role == "" {
        req.Role = "User"
    }

    // 验证角色是否有效
    if req.Role != "Admin" && req.Role != "User" {
        return nil, errors.New("无效的用户角色")
    }

    // 对密码进行加密
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, errors.New("密码加密失败")
    }

    // 创建新用户
    user := &models.User{
        Username:     req.Username,
        PasswordHash: string(hashedPassword),
        Role:        req.Role,
    }

    if err := utils.DB.Create(user).Error; err != nil {
        return nil, errors.New("创建用户失败")
    }

    return user, nil
} 