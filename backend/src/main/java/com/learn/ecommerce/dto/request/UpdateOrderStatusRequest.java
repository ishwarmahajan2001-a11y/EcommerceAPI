package com.learn.ecommerce.dto.request;

import com.learn.ecommerce.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(

        @NotNull(message = "status is required")
        OrderStatus status
) {
}
