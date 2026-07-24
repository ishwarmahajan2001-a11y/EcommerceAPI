package com.learn.ecommerce.repository;

import com.learn.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data JPA repository. Extending JpaRepository gives us CRUD,
 * pagination and sorting for free. Method names are parsed into queries
 * (derived query methods) - no SQL needed for simple lookups.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
