package com.learn.ecommerce.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger configuration. Declares a "bearer-jwt" security scheme so
 * the Swagger UI shows an "Authorize" button for pasting your JWT.
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "E-Commerce Order API",
                version = "1.0",
                description = "Spring Boot learning project: products, orders, JWT auth."))
@SecurityScheme(
        name = "bearer-jwt",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT")
public class OpenApiConfig {
}
