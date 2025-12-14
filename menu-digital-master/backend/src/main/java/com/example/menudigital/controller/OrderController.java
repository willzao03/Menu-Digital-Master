package com.example.menudigital.controller;

import com.example.menudigital.dto.OrderRequest;
import com.example.menudigital.model.Order;
import com.example.menudigital.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    // 🆕 Listar todos os pedidos
    @GetMapping
    public List<Order> getAll() {
        return service.getAllOrders();
    }

    @PostMapping
    public Order create(@RequestBody OrderRequest request) {
        return service.createOrder(request);
    }

    @GetMapping("/{id}")
    public Order get(@PathVariable Long id) {
        return service.getOrder(id);
    }

    // Buscar pedido pelo TOKEN
    @GetMapping("/token/{token}")
    public Order getByToken(@PathVariable String token) {
        return service.getOrderByToken(token);
    }

    // 🍕 Editar pedido pelo ID
    @PutMapping("/{id}")
    public Order update(@PathVariable Long id, @RequestBody OrderRequest request) {
        return service.updateOrder(id, request);
    }

    // 🗑️ Deletar pedido pelo ID
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteOrder(id);
    }
}