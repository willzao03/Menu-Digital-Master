package com.example.menudigital.dto;

import java.util.List;

public class OrderRequest {

    private String customerName;
    private String tableNumber;
    private List<OrderItemDTO> items;

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getTableNumber() {
        return tableNumber;
    }
    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}