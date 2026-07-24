package com.learn.ecommerce.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequest(

        @NotEmpty(message = "an order must contain at least one item")
        @Valid
        List<OrderItemRequest> items
) {
}
