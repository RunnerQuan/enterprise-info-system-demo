package utils

import (
	"log"

	"enterprise-info-system-gin/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() {
    username := "root"        // 数据库用户名
    password := "123456"     // 数据库密码
    host := "127.0.0.1"      // 数据库主机地址
    port := "3306"           // 数据库端口
    dbname := "enterprise_information_management_system" // 数据库名称

    dsn := username + ":" + password + "@tcp(" + host + ":" + port + ")/" + dbname + "?charset=utf8mb4&parseTime=True&loc=Local"
    
    var err error
    DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Info),
    })
    if err != nil {
        log.Fatal("数据库连接失败:", err)
    }
    log.Println("数据库连接成功")

    // 自动迁移
    err = DB.AutoMigrate(&models.User{})
    if err != nil {
        log.Fatal("数据库迁移失败:", err)
    }
} 