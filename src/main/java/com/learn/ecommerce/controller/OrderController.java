package com.learn.ecommerce.controller;

import com.learn.ecommerce.dto.request.OrderRequest;
import com.learn.ecommerce.dto.request.UpdateOrderStatusRequest;
import com.learn.ecommerce.dto.response.OrderResponse;
import com.learn.ecommerce.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Order endpoints. All require authentication (see SecurityConfig).
 * The current user's identity comes from the Authentication object,
 * which Spring injects from the SecurityContext populated by JwtAuthFilter.
 */
@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders")
@SecurityRequirement(name = "bearer-jwt")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Place a new order")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest request,
                                                    Authentication authentication) {
        OrderResponse response = orderService.placeOrder(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "List my orders")
    public ResponseEntity<List<OrderResponse>> myOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getMyOrders(authentication.getName()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get one of my orders by id")
    public ResponseEntity<OrderResponse> getById(@PathVariable Long id,
                                                 Authentication authentication) {
        return ResponseEntity.ok(orderService.getById(id, authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (ADMIN)")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id,
                                                      @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.status()));
    }
}
