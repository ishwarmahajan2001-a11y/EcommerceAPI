📦 E-Commerce Application
│
├── 📖 About
├── ✨ Features
├── 🏗 Architecture
├── 📂 Project Structure
├── ⚙ Getting Started
├── 🔐 JWT Authentication
├── 📡 REST APIs
├── 🗄 Database Schema
├── 🔄 Request Flow
├── 🧪 Testing
├── 🐳 Docker
├── ☁ AWS Deployment
├── 🚀 Future Enhancements
├── 💼 Interview Highlights
└── 👨‍💻 Author

# 🛒 E-Commerce Application

<p align="center">

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-brightgreen?style=for-the-badge&logo=springboot)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-success?style=for-the-badge)
![Hibernate](https://img.shields.io/badge/Hibernate-JPA-brown?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Maven](https://img.shields.io/badge/Maven-Build-red?style=for-the-badge&logo=apachemaven)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

</p>

<p align="center">

A production-style Full Stack E-Commerce application built with **Spring Boot**, **React**, and **JWT Authentication** demonstrating real-world backend development concepts such as REST APIs, Role-Based Authorization, Spring Security, JPA, Order Management, and Production Architecture.

</p>

---

# 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Modules](#-project-modules)
- [Project Structure](#-project-structure)
- [Backend Features](#-backend-features)
- [Frontend Features](#-frontend-features)
- [Application Workflow](#-application-workflow)

---

# 📌 Project Overview

This project simulates a real-world E-Commerce platform where users can browse products, register, authenticate using JWT, place orders, and track order history while administrators can manage products and orders.

The application follows modern backend development practices including:

- Layered Architecture
- RESTful APIs
- JWT Authentication
- Role-Based Authorization
- DTO Pattern
- Global Exception Handling
- Bean Validation
- Spring Security
- JPA/Hibernate
- Unit Testing
- Integration Testing

This project is designed to strengthen Spring Boot fundamentals and demonstrate production-ready backend development skills commonly expected in Java Backend Developer interviews.

---

# ✨ Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- BCrypt Password Encryption
- Stateless Authentication
- Spring Security
- Role-Based Authorization

---

## Product Management

- Add Products
- Update Products
- Delete Products
- View Product Details
- Pagination
- Sorting

---

## Order Management

- Place Orders
- Stock Validation
- Automatic Order Total Calculation
- Order History
- Order Status Update
- Admin Order Management

---

## Validation

- Email Validation
- Password Validation
- Required Field Validation
- Quantity Validation
- Product Validation

---

## Exception Handling

- Global Exception Handler
- Validation Errors
- Resource Not Found
- Authentication Errors
- Business Exceptions

---

## Testing

- Unit Testing
- Mockito
- Integration Testing
- MockMvc
- Service Tests
- Controller Tests

---

# 💻 Technology Stack

## Backend

| Technology | Description |
|------------|-------------|
| Java 21 | Programming Language |
| Spring Boot 3.3.5 | Backend Framework |
| Spring Security | Authentication & Authorization |
| Spring Data JPA | ORM Layer |
| Hibernate | Persistence Provider |
| JWT | Authentication |
| Maven | Build Tool |
| H2 Database | Development Database |
| Swagger OpenAPI | API Documentation |
| Lombok | Boilerplate Reduction |
| JUnit 5 | Unit Testing |
| Mockito | Mock Testing |

---

## Frontend

| Technology | Description |
|------------|-------------|
| React 18 | UI Framework |
| React Router | Routing |
| React Query | API State Management |
| Axios | HTTP Client |
| Tailwind CSS | Styling |
| Vite | Build Tool |

---

# 🏛 Architecture

```text
                   Client (React)

                           │

                           ▼

                 Spring Security Filter

                           │

                           ▼

                    JWT Authentication

                           │

                           ▼

                     REST Controllers

                           │

                           ▼

                     Service Layer

                           │

                           ▼

                  Repository Layer

                           │

                           ▼

                     H2 Database
```

---

# 📦 Project Modules

```
E-Commerce Application

│

├── Backend

│      ├── Authentication

│      ├── Product Management

│      ├── Order Management

│      ├── Security

│      ├── Validation

│      └── Exception Handling

│

└── Frontend

       ├── Login

       ├── Register

       ├── Product Catalog

       ├── Cart

       ├── Checkout

       ├── Orders

       └── Admin Dashboard
```

---

# 📂 Project Structure

```text
EcommerceAPI/

│

├── backend/

│     ├── src

│     │     ├── main

│     │     │      ├── controller

│     │     │      ├── service

│     │     │      ├── repository

│     │     │      ├── entity

│     │     │      ├── dto

│     │     │      ├── security

│     │     │      ├── config

│     │     │      └── exception

│     │

│     └── pom.xml

│

├── frontend/

│      ├── src

│      ├── components

│      ├── pages

│      ├── hooks

│      ├── services

│      └── package.json

│

└── README.md
```

---

# 🚀 Backend Features

- Spring Boot REST API
- Spring Security
- JWT Authentication
- Role-Based Authorization
- Spring Data JPA
- Hibernate ORM
- Bean Validation
- Global Exception Handling
- DTO Mapping
- Layered Architecture
- Swagger Documentation
- H2 Database
- JUnit Testing
- Mockito Testing

---

# 🎨 Frontend Features

- React 18
- Vite
- Tailwind CSS
- React Router
- React Query
- Axios
- JWT Authentication
- Session Storage
- Admin Dashboard
- Shopping Cart
- Checkout
- Product Details
- Order History

---

# 🔄 Application Workflow

```text
User

 │

 ▼

Login/Register

 │

 ▼

JWT Generated

 │

 ▼

JWT Stored

 │

 ▼

API Request

 │

 ▼

JWT Validation

 │

 ▼

Spring Security

 │

 ▼

Controller

 │

 ▼

Service

 │

 ▼

Repository

 │

 ▼

Database

 │

 ▼

JSON Response
```

---

➡️ Continue to **Part 2** for installation, API endpoints, authentication flow, Swagger, H2 setup, and project execution.
