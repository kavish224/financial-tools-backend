export class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode < 400
        this.timestamp = new Date().toISOString();
        
    }
    static success(data, message = "Success", statusCode = 200, meta = {}) {
        return new ApiResponse(statusCode, data, message, meta);
    }

    static created(data, message = "Created successfully", meta = {}) {
        return new ApiResponse(201, data, message, meta);
    }

    static noContent(message = "No content") {
        return new ApiResponse(204, null, message);
    }
} 