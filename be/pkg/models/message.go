package models

import (
	"time"

	"github.com/google/uuid"
)

// Message represents the data structure we'll send through SSE
// @Description A message sent through the SSE stream
type Message struct {
	UUID      uuid.UUID `json:"id" example:"550e8400-e29b-41d4-a716-446655440000" format:"uuid"`
	Text      string    `json:"text" example:"Hello, world!"`
	Timestamp time.Time `json:"timestamp" example:"2023-01-01T12:00:00Z" format:"date-time"`
	User      User      `json:"user"`
} 