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
	// Set necessary headers for SSE
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")
	c.Writer.Header().Set("X-Accel-Buffering", "no")
	
	// Ensure that the writer supports flushing
	c.Writer.Flush()
	
	// Set status code to 200 before writing body
	c.Status(http.StatusOK)
	
	// Send lots of data every 100ms
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()
	
	// Dummy data counter
	counter := 0
	
	// Create a channel to detect when the client disconnects
	clientGone := c.Request.Context().Done()
	
	// Loop until client disconnects
	for {
		select {
		case <-clientGone:
			log.Println("Client disconnected")
			return
		case t := <-ticker.C:
			counter++
			
			// Create an array of messages (currently just one message for demo)
			msgs := []models.Message{
				{
					UUID:      uuid.New(),
					Text:      fmt.Sprintf("Message #%d", counter),
					Timestamp: t,
					User: models.User{
						ID: uuid.New(),
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