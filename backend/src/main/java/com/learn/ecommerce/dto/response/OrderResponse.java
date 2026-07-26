package com.learn.ecommerce.dto.response;

import com.learn.ecommerce.entity.Order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        String username,
        List<OrderItemResponse> items,
        BigDecimal totalAmount,
        String status,
        Instant createdAt
) {
    public static OrderResponse from(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(OrderItemResponse::from)
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getUser().getUsername(),
                items,
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getCreatedAt()
        );
    }
}
