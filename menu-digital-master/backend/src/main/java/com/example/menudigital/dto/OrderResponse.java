package com.example.menudigital.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class OrderResponse {
    private String token;
    private String status;
    private BigDecimal total;
    private String itemsJson;
    private OffsetDateTime createdAt;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public String getItemsJson() { return itemsJson; }
    public void setItemsJson(String itemsJson) { this.itemsJson = itemsJson; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
