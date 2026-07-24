package com.learn.ecommerce.service;

import com.learn.ecommerce.dto.request.ProductRequest;
import com.learn.ecommerce.dto.response.ProductResponse;
import com.learn.ecommerce.entity.Product;
import com.learn.ecommerce.exception.ResourceNotFoundException;
import com.learn.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Pure unit test for ProductService using Mockito (no Spring context, fast).
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void create_savesAndReturnsProduct() {
        ProductRequest request = new ProductRequest(
                "Laptop Stand", "Aluminium", new BigDecimal("45.00"), 30);

        Product saved = Product.builder()
                .id(1L).name("Laptop Stand").description("Aluminium")
                .price(new BigDecimal("45.00")).stockQuantity(30).build();
        when(productRepository.save(any(Product.class))).thenReturn(saved);

        ProductResponse response = productService.create(request);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Laptop Stand");
        assertThat(response.price()).isEqualByComparingTo("45.00");
    }

    @Test
    void getById_whenMissing_throwsNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Product not found with id: 99");
    }

    @Test
    void getById_whenPresent_returnsProduct() {
        Product product = Product.builder()
                .id(5L).name("Webcam").description("1080p")
                .price(new BigDecimal("59.99")).stockQuantity(10).build();
        when(productRepository.findById(5L)).thenReturn(Optional.of(product));

        ProductResponse response = productService.getById(5L);

        assertThat(response.name()).isEqualTo("Webcam");
        assertThat(response.stockQuantity()).isEqualTo(10);
    }
}
