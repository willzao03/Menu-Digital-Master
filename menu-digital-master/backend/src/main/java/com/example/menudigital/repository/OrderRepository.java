package com.example.menudigital.repository;

import com.example.menudigital.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByToken(String token);
}