package com.example.menudigital.service;

import com.example.menudigital.dto.OrderRequest;
import com.example.menudigital.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    public OrderEntity createOrder(OrderRequest req) {
        OrderEntity o = new OrderEntity();
        o.setName(req.getName());
        o.setAge(req.getAge());
        o.setTableNumber(req.getTableNumber());
        o.setItemsJson(req.getItemsJson());
        o.setTotal(req.getTotal());
        o.setToken(generateToken());
        o.setStatus("CREATED");
        o.setCreatedAt(OffsetDateTime.now());
        return repo.save(o);
    }

    public OrderEntity findByToken(String token) {
        return repo.findByToken(token).orElse(null);
    }

    public java.util.List<OrderEntity> listAll() {
        return repo.findAll();
    }

    private String generateToken() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }
}
