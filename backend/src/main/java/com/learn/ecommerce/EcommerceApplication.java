package com.learn.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application entry point.
 *
 * @SpringBootApplication is a convenience annotation that bundles:
 *   - @Configuration        -> marks this class as a source of bean definitions
 *   - @EnableAutoConfiguration -> Spring Boot auto-configures beans from the classpath
 *   - @ComponentScan        -> scans this package (and sub-packages) for @Component/@Service/etc.
 */
@SpringBootApplication
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }
}
