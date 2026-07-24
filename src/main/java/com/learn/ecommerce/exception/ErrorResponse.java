package com.learn.ecommerce.exception;

import java.time.Instant;
import java.util.Map;

/**
 * Consistent error body returned for every failure.
 * (Loosely follows RFC 7807 problem-detail style.)
 */
public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
    public static ErrorResponse of(int status, String error, String message, String path) {
        return new ErrorResponse(Instant.now(), status, error, message, path, null);
    }

    public static ErrorResponse validation(int status, String error, String message,
                                           String path, Map<String, String> fieldErrors) {
        return new ErrorResponse(Instant.now(), status, error, message, path, fieldErrors);
    }
}
