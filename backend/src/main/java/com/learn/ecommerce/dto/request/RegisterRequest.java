package com.learn.ecommerce.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Registration payload. Validation annotations run when the controller
 * parameter is marked @Valid; failures are turned into 400 responses by
 * the GlobalExceptionHandler.
 */
public record RegisterRequest(

        @NotBlank(message = "username is required")
        @Size(min = 3, max = 50, message = "username must be 3-50 characters")
        String username,

        @NotBlank(message = "email is required")
        @Email(message = "email must be valid")
        String email,

        @NotBlank(message = "password is required")
        @Size(min = 6, max = 100, message = "password must be at least 6 characters")
        String password
) {
}
