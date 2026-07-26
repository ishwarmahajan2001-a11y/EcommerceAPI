package com.learn.ecommerce.entity;

/**
 * User roles. Spring Security expects authorities prefixed with "ROLE_",
 * so we expose that mapping where needed (see CustomUserDetailsService).
 */
public enum Role {
    USER,
    ADMIN
}
