package com.learn.ecommerce.exception;

/**
 * Thrown for invalid business operations (e.g. insufficient stock,
 * duplicate username). Mapped to HTTP 400.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
