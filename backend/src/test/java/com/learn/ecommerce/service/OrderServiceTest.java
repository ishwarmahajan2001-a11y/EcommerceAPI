package com.learn.ecommerce.service;

import com.learn.ecommerce.dto.request.OrderItemRequest;
import com.learn.ecommerce.dto.request.OrderRequest;
import com.learn.ecommerce.dto.response.OrderResponse;
import com.learn.ecommerce.entity.Order;
import com.learn.ecommerce.entity.Product;
import com.learn.ecommerce.entity.Role;
import com.learn.ecommerce.entity.User;
import com.learn.ecommerce.exception.BadRequestException;
import com.learn.ecommerce.repository.OrderRepository;
import com.learn.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Unit test for OrderService covering the happy path and the
 * insufficient-stock business rule.
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProductService productService;

    @InjectMocks private OrderService orderService;

    private User user() {
        return User.builder().id(1L).username("john").email("john@shop.dev")
                .password("x").role(Role.USER).build();
    }

    @Test
    void placeOrder_computesTotalAndDecrementsStock() {
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user()));

        Product product = Product.builder()
                .id(10L).name("Mouse").price(new BigDecimal("20.00")).stockQuantity(5).build();
        when(productService.findEntity(10L)).thenReturn(product);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderRequest request = new OrderRequest(List.of(new OrderItemRequest(10L, 2)));

        OrderResponse response = orderService.placeOrder("john", request);

        assertThat(response.totalAmount()).isEqualByComparingTo("40.00");
        assertThat(response.items()).hasSize(1);
        assertThat(product.getStockQuantity()).isEqualTo(3); // 5 - 2
    }

    @Test
    void placeOrder_whenInsufficientStock_throws() {
        when(userRepository.findByUsername("john")).thenReturn(Optional.of(user()));

        Product product = Product.builder()
                .id(10L).name("Mouse").price(new BigDecimal("20.00")).stockQuantity(1).build();
        when(productService.findEntity(10L)).thenReturn(product);

        OrderRequest request = new OrderRequest(List.of(new OrderItemRequest(10L, 5)));

        assertThatThrownBy(() -> orderService.placeOrder("john", request))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Insufficient stock");
    }
}
