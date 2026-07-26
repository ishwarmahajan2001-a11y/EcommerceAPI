package com.learn.ecommerce.repository;

import com.learn.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Product repository. JpaRepository provides findAll(Pageable) for pagination.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {
}
