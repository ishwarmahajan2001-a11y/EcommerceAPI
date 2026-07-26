package com.learn.ecommerce.service;

import com.learn.ecommerce.dto.request.OrderItemRequest;
import com.learn.ecommerce.dto.request.OrderRequest;
import com.learn.ecommerce.dto.response.OrderResponse;
import com.learn.ecommerce.entity.Order;
import com.learn.ecommerce.entity.OrderItem;
import com.learn.ecommerce.entity.OrderStatus;
import com.learn.ecommerce.entity.Product;
import com.learn.ecommerce.entity.User;
import com.learn.ecommerce.exception.BadRequestException;
import com.learn.ecommerce.exception.ResourceNotFoundException;
import com.learn.ecommerce.repository.OrderRepository;
import com.learn.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Order placement and retrieval. Placing an order validates stock,
 * decrements inventory, snapshots prices, and computes the total - all
 * inside a single transaction so a failure rolls everything back.
 */
@Service
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ProductService productService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    @Transactional
    public OrderResponse placeOrder(String username, OrderRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> ResourceNotFoundException.of("User", username));

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .createdAt(Instant.now())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : request.items()) {
            Product product = productService.findEntity(itemReq.productId());

            if (product.getStockQuantity() < itemReq.quantity()) {
                throw new BadRequestException(
                        "Insufficient stock for product '" + product.getName()
                                + "'. Available: " + product.getStockQuantity());
            }
            product.setStockQuantity(product.getStockQuantity() - itemReq.quantity());

            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.quantity())
                    .unitPrice(product.getPrice())
                    .build();
            order.addItem(item);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }

        order.setTotalAmount(total);
        return OrderResponse.from(orderRepository.save(order));
    }

    public List<OrderResponse> getMyOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> ResourceNotFoundException.of("User", username));
        return orderRepository.findByUserId(user.getId()).stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse getById(Long id, String username) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Order", id));
        // A user may only view their own orders.
        if (!order.getUser().getUsername().equals(username)) {
            throw new BadRequestException("You can only view your own orders");
        }
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Order", id));
        order.setStatus(status);
        return OrderResponse.from(orderRepository.save(order));
    }
}
