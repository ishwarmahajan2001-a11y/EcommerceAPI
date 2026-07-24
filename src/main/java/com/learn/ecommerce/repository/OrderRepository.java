package com.learn.ecommerce.repository;

import com.learn.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Order repository. Derived query method to fetch a user's orders.
 */
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);
}
