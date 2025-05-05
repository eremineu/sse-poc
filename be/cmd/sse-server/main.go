package main

import (
	"log"

	_ "sse/docs" // Import for swagger to find the generated docs
	"sse/internal/server"
)

// @title SSE Gadget API
// @version 1.0
// @description Server-Sent Events Gadget Backend API
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /
// @schemes http
func main() {
	// Get default server configuration
	config := server.DefaultConfig()
	
	// Start the server
	log.Fatal(server.Start(config))
} 