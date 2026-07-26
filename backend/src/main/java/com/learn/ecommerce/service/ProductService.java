package com.learn.ecommerce.service;

import com.learn.ecommerce.dto.request.ProductRequest;
import com.learn.ecommerce.dto.response.ProductResponse;
import com.learn.ecommerce.entity.Product;
import com.learn.ecommerce.exception.ResourceNotFoundException;
import com.learn.ecommerce.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Product CRUD business logic.
 *
 * @Transactional(readOnly = true) at class level optimizes read paths;
 * write methods override it with a read-write transaction.
 */
@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<ProductResponse> getAll(Pageable pageable) {
        return productRepository.findAll(pageable).map(ProductResponse::from);
    }

    public ProductResponse getById(Long id) {
        Product product = findEntity(id);
        return ProductResponse.from(product);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .stockQuantity(request.stockQuantity())
                .build();
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findEntity(id);
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStockQuantity(request.stockQuantity());
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = findEntity(id);
        productRepository.delete(product);
    }

    /** Shared lookup used by the OrderService too. */
    public Product findEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Product", id));
    }
}
