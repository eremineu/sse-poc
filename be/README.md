# SSE PoC Backend

## Setup

1. Install the latest version of Go from [golang.org/dl](https://golang.org/dl/)
2. Clone this repository
3. Navigate to the project directory

## Running the Project

```bash
go mod download  # Install dependencies
go run main.go   # Start the server
```

## Swagger Documentation

1. Install swag CLI tool (if not already installed):
```bash
go install github.com/swaggo/swag/cmd/swag@latest
```

2. Generate Swagger docs:
```bash
swag init -g cmd/sse-server/main.go
```

3. Access Swagger UI at: http://localhost:8080/swagger/index.html (when server is running)

