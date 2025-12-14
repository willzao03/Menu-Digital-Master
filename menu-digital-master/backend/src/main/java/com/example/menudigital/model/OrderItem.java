package com.example.menudigital.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore; // ⬅️ Importação para resolver o loop JSON

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private int quantity;

    // 🔗 Relacionamento: Muitos OrderItems pertencem a UM Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id") // Coluna que armazena a chave estrangeira
    @JsonIgnore // ⬅️ CORREÇÃO: Impede o loop infinito na serialização JSON (Order -> Items -> Order -> ...)
    private Order order;

    // Construtor padrão (necessário para JPA)
    public OrderItem() {}

    // -----------------------------------------------------------------
    // Getters e Setters
    // -----------------------------------------------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    // O método setOrder() é crucial para manter a consistência do relacionamento bidirecional
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}