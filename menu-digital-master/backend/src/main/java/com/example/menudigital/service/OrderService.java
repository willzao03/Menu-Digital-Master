package com.example.menudigital.service;

import com.example.menudigital.dto.OrderRequest;
import com.example.menudigital.model.Order;
import com.example.menudigital.model.OrderItem;
import com.example.menudigital.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;
import java.util.UUID;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class OrderService {

    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    // 🆕 Método para listar todos os pedidos
    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());
        order.setStatus("PENDING");
        order.setToken(UUID.randomUUID().toString());

        List<OrderItem> items = request.getItems().stream()
                .map(i -> {
                    OrderItem oi = new OrderItem();
                    oi.setName(i.name);
                    oi.setPrice(i.price);
                    oi.setQuantity(i.quantity);
                    oi.setOrder(order);
                    return oi;
                })
                .collect(Collectors.toList());

        order.setItems(items);

        double total = items.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        order.setTotal(total);
        return repository.save(order);
    }

    public Order getOrder(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com o ID: " + id));
    }

    public Order getOrderByToken(String token) {
        Order order = repository.findByToken(token);
        if (order == null) {
            throw new NoSuchElementException("Pedido não encontrado com o token: " + token);
        }
        return order;
    }

    @Transactional
    public Order updateOrder(Long id, OrderRequest request) {
        Order order = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido a ser atualizado não encontrado com o ID: " + id));

        order.setCustomerName(request.getCustomerName());
        order.setTableNumber(request.getTableNumber());

        // Limpa os itens antigos e adiciona os novos
        order.getItems().clear();

        List<OrderItem> updatedItems = request.getItems().stream()
                .map(i -> {
                    OrderItem oi = new OrderItem();
                    oi.setName(i.name);
                    oi.setPrice(i.price);
                    oi.setQuantity(i.quantity);
                    oi.setOrder(order);
                    return oi;
                })
                .collect(Collectors.toList());

        order.setItems(updatedItems);

        // Recalcula o total
        double total = updatedItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        order.setTotal(total);

        return repository.save(order);
    }

    public void deleteOrder(Long id) {
        if (!repository.existsById(id)) {
            throw new NoSuchElementException("Pedido a ser deletado não encontrado com o ID: " + id);
        }
        repository.deleteById(id);
    }
}