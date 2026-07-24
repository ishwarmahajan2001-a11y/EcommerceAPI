package com.learn.ecommerce.service;

import com.learn.ecommerce.dto.request.LoginRequest;
import com.learn.ecommerce.dto.request.RegisterRequest;
import com.learn.ecommerce.dto.response.AuthResponse;
import com.learn.ecommerce.entity.Role;
import com.learn.ecommerce.entity.User;
import com.learn.ecommerce.exception.BadRequestException;
import com.learn.ecommerce.repository.UserRepository;
import com.learn.ecommerce.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Handles registration and login. @Service marks it as a business-logic bean.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("Username already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password())) // hash, never store plain text
                .role(Role.USER)
                .build();
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.bearer(token, user.getUsername(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException (-> 401) if authentication fails.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.bearer(token, user.getUsername(), user.getRole().name());
    }
}
