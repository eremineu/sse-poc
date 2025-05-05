package handler

import (
	"net/http"
	"sse/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetUserInfo returns hardcoded user information
// @Summary Get user information
// @Description Returns hardcoded user information
// @Tags user
// @Accept json
// @Produce json
// @Success 200 {object} models.User
// @Router /user [get]
func GetUserInfo(c *gin.Context) {
	id, _ := uuid.Parse("550e8400-e29b-41d4-a716-446655440000")
	labelID, _ := uuid.Parse("550e8400-e29b-41d4-a716-446655440001")
	
	user := models.User{
		ID:       id,
		Username: "john_doe",
		Email:    "john.doe@example.com",
		Nickname: "Johnny",
		Labels: []models.Label{
			{
				ID:    labelID,
				Name:  "Premium",
				Color: "#FFD700",
			},
		},
	}

	c.JSON(http.StatusOK, user)
} 