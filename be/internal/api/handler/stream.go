package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"sse/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// StreamHandler is the Gin-compatible version of StreamHandler
// @Summary Subscribe to the SSE stream
// @Description Establishes an SSE connection and receives real-time updates
// @Tags stream
// @Accept  json
// @Produce  text/event-stream
// @Success 200 {array} models.Message
// @Router /stream [get]
func StreamHandler(c *gin.Context) {
	// Get query parameters
	userID := c.Query("user_id")
	limitStr := c.DefaultQuery("limit", "10") 
	
	// Parse limitStr to int (ignoring error for simplicity)
	limit := 10
	fmt.Sscanf(limitStr, "%d", &limit)
	
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")
	c.Writer.Header().Set("X-Accel-Buffering", "no")
	
	c.Writer.Flush()
	
	c.Status(http.StatusOK)
	
	ticker := time.NewTicker(1 * time.Millisecond)
	defer ticker.Stop()
	
	// Dummy data counter
	counter := 0
	
	// Create a channel to detect when the client disconnects
	clientGone := c.Request.Context().Done()

	log.Println("limit", limit)
	log.Println("userID", userID)
	
	// Loop until client disconnects
	for {
		select {
		case <-clientGone:
			log.Println("Client disconnected")
			return
		case t := <-ticker.C:
			counter++
			
			if counter > limit {
				ticker.Reset(500 * time.Millisecond)
			}
			
			// Create an array of messages (currently just one message for demo)
			msgs := []models.Message{
				{
					UUID:      uuid.New(),
					Text:      fmt.Sprintf("Message #%d", counter),
					Timestamp: t,
					User: models.User{
						ID: getUserID(userID), // Handle empty userID case
						Username: "John Doe",
						Email: "john.doe@example.com",
						Password: "password123",
						Nickname: "johndoe",
						Labels: []models.Label{
							{
								ID:   uuid.New(),
								Name: "Label 1",
								Color: "#000000",
							},
						},
					},
				},
			}
			
			// Marshal array to JSON
			jsonData, err := json.Marshal(msgs)
			if err != nil {
				log.Printf("Error marshaling to JSON: %v", err)
				continue
			}
			
			// Send SSE-formatted message with JSON data
			fmt.Fprintf(c.Writer, "data: %s\n\n", jsonData)
			c.Writer.Flush()
		}
	}
}

func getUserID(userIDStr string) uuid.UUID {
	if userIDStr == "" {
		return uuid.New()
	}
	
	id, err := uuid.Parse(userIDStr)
	if err != nil {
		return uuid.New()
	}
	return id
} 