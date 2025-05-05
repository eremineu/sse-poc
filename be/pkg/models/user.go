package models

import (
	"github.com/google/uuid"
)

// User represents a user in the system
// @Description User account information
type User struct {
	ID uuid.UUID `json:"id"`
	Username string `json:"username"`
	Email string `json:"email"`
	Nickname string `json:"nickname"`
	Password string `json:"-"` // Never expose password in JSON responses
	Labels []Label `json:"labels"`
}
