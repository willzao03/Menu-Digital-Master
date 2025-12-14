package com.example.menudigital.dto;

public class OrderItemDTO {

    public String name;
    public Double price;
    public Integer quantity;

    // GETTERS E SETTERS OPCIONAIS (mas não são obrigatórios)
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}