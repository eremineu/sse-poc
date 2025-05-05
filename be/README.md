# SSE Gadget Backend

A Go backend service that provides Server-Sent Events (SSE) functionality with proper CORS support.

## Features

- Server-Sent Events (SSE) endpoint
- CORS support for cross-domain requests
- Swagger/OpenAPI documentation

## Getting Started

### Prerequisites

- Go 1.24 or later

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Run the application:

```bash
go run cmd/sse-server/main.go
```

The server will start on port 8080.

## API Endpoints

- **SSE Stream**: `http://localhost:8080/stream`
  - Establishes an SSE connection and receives real-time updates
  
- **API Documentation**: `http://localhost:8080/swagger/index.html`
  - Interactive Swagger UI to explore the API

## CORS Support

This application includes built-in CORS support that allows requests from any origin. The CORS configuration:

- Allows all origins (`Access-Control-Allow-Origin: *`)
- Supports common HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`)
- Allows standard headers like `Content-Type` and `Authorization`
- Handles preflight requests automatically

### Testing CORS

You can test CORS support using:

```javascript
// Browser console
const eventSource = new EventSource('http://localhost:8080/stream');
eventSource.onmessage = (event) => {
  console.log(JSON.parse(event.data));
};
```

## Development

### Project Structure

- `cmd/sse-server` - Application entry point
- `internal/api` - API handlers and routing
- `internal/api/middleware` - Middleware including CORS support
- `internal/server` - Server configuration
- `pkg/models` - Data models

### Rebuilding API Documentation

After modifying API endpoints or models, regenerate the Swagger documentation:

```bash
swag init -g cmd/sse-server/main.go
```

## License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details. 