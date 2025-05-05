package models

import (
	"github.com/google/uuid"
)

// Label represents a tag or category label for users
// @Description A tag or category that can be assigned to users
type Label struct {
	ID    uuid.UUID `json:"id" example:"550e8400-e29b-41d4-a716-446655440000" format:"uuid"`
	Name  string    `json:"name" example:"admin"`
	Color string    `json:"color" example:"#FF5733"`
}
