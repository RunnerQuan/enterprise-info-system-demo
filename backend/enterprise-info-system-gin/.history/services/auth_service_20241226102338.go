package services

import (
	"errors"
	"your-project/models"
	"your-project/utils"
)

type LoginRequest struct {
    Username     string `json:"username"`
    PasswordHash string `json:"password_hash"`
}

func Login(req LoginRequest) (*models.User, error) {
    var user models.User
    result := utils.DB.Where("username = ?", req.Username).First(&user)
    if result.Error != nil {
        return nil, errors.New("用户名不存在")
    }

    if user.PasswordHash != req.PasswordHash {
        return nil, errors.New("密码错误")
    }

    return &user, nil
}

type RegisterRequest struct {
    Username     string `json:"username"`
    PasswordHash string `json:"password_hash"`
    Role         string `json:"role"`
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

    // 创建新用户，直接使用前端传来的加密密码
    user := &models.User{
        Username:     req.Username,
        PasswordHash: req.PasswordHash,
        Role:        req.Role,
    }

    if err := utils.DB.Create(user).Error; err != nil {
        return nil, errors.New("创建用户失败")
    }

    return user, nil
} 