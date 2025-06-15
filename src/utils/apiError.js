class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "",
        isOperational = true
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
    static badRequest(message = "Bad Request", errors = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }

    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }

    static notFound(message = "Not Found") {
        return new ApiError(404, message);
    }

    static conflict(message = "Conflict") {
        return new ApiError(409, message);
    }

    static tooManyRequests(message = "Too Many Requests") {
        return new ApiError(429, message);
    }

    static internal(message = "Internal Server Error") {
        return new ApiError(500, message);
    }

    static badGateway(message = "Bad Gateway") {
        return new ApiError(502, message);
    }

    static serviceUnavailable(message = "Service Unavailable") {
        return new ApiError(503, message);
    }
}
export { ApiError }