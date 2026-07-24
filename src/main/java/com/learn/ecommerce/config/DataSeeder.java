package com.learn.ecommerce.config;

import com.learn.ecommerce.entity.Product;
import com.learn.ecommerce.entity.Role;
import com.learn.ecommerce.entity.User;
import com.learn.ecommerce.repository.ProductRepository;
import com.learn.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds demo data on startup so you can log in and test immediately.
 *
 * A CommandLineRunner bean runs once after the context is ready.
 * Credentials (dev only):
 *   admin / admin123   (ROLE_ADMIN)
 *   john  / john123    (ROLE_USER)
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(UserRepository userRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(User.builder()
                        .username("admin")
                        .email("admin@shop.dev")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build());

                userRepository.save(User.builder()
                        .username("john")
                        .email("john@shop.dev")
                        .password(passwordEncoder.encode("john123"))
                        .role(Role.USER)
                        .build());
            }

            if (productRepository.count() == 0) {
                productRepository.saveAll(List.of(
                        Product.builder().name("Wireless Mouse").description("Ergonomic 2.4GHz mouse")
                                .price(new BigDecimal("19.99")).stockQuantity(100).build(),
                        Product.builder().name("Mechanical Keyboard").description("RGB, blue switches")
                                .price(new BigDecimal("79.50")).stockQuantity(50).build(),
                        Product.builder().name("USB-C Hub").description("7-in-1 aluminium hub")
                                .price(new BigDecimal("34.00")).stockQuantity(75).build()
                ));
            }
        };
    }
}
