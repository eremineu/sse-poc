package server

import (
	"fmt"
	"net/http"
	"time"

	"sse/internal/api/router"
)

type Config struct {
	Port         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

func DefaultConfig() Config {
	return Config{
		Port:         "8080",
		ReadTimeout:  0, //15 * time.Second,
		WriteTimeout: 0, //15 * time.Second,
		IdleTimeout:  0, //60 * time.Second,
		// SSE doesn't work properly with timeouts
	}
}

func Start(cfg Config) error {
	// Get the Gin router
	r := router.SetupRoutes()

	// Configure http server
	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           r,
		ReadTimeout:       cfg.ReadTimeout,
		ReadHeaderTimeout: cfg.ReadTimeout,
		WriteTimeout:      cfg.WriteTimeout,
		IdleTimeout:       cfg.IdleTimeout,
	}

	// Print server info
	fmt.Printf("Server started at http://localhost:%s/stream\n", cfg.Port)
	fmt.Printf("Swagger documentation available at http://localhost:%s/swagger/index.html\n", cfg.Port)
	
	// Start the server
	return server.ListenAndServe()
} 