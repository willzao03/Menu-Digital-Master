package com.example.menudigital.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    @Column(name = "table_number")
    private String tableNumber;

    private Double total;

    private String status;

    @Column(unique = true)
    private String token;

    // ✅ CORREÇÃO CRUCIAL PARA DELETE CASCATA:
    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Construtor padrão (necessário para JPA)
    public Order() {}

    // Getters
    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getTableNumber() { return tableNumber; }
    public Double getTotal() { return total; }
    public String getStatus() { return status; }
    public String getToken() { return token; }
    public List<OrderItem> getItems() { return items; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }
    public void setTotal(Double total) { this.total = total; }
    public void setStatus(String status) { this.status = status; }
    public void setToken(String token) { this.token = token; }

    // Setter que mantém o relacionamento bidirecional consistente
    public void setItems(List<OrderItem> items) {
        this.items.clear();
        if (items != null) {
            items.forEach(item -> {
                item.setOrder(this);
                this.items.add(item);
            });
        }
    }
}