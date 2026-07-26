package com.learn.ecommerce.dto.response;

import com.learn.ecommerce.entity.Product;

import java.math.BigDecimal;

/**
 * Product view exposed to clients. Mapping entity -> DTO keeps the API
 * decoupled from the database schema.
 */
public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer stockQuantity
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStockQuantity()
        );
    }
}
