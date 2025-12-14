const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
}

export interface Order {
  id: number;
  customerName: string;
  tableNumber: string;
  total: number;
  status: string;
  token: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
}

export const orderApi = {
  // Criar novo pedido
  createOrder: async (orderData: OrderRequest): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar pedido');
    }

    return response.json();
  },

  // Buscar pedido por token
  getOrderByToken: async (token: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/token/${token}`);

    if (!response.ok) {
      throw new Error('Pedido não encontrado');
    }

    return response.json();
  },

  // Buscar pedido por ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);

    if (!response.ok) {
      throw new Error('Pedido não encontrado');
    }

    return response.json();
  },

  // Listar todos os pedidos
  getAllOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders`);

    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos');
    }

    return response.json();
  },

  // Atualizar pedido
  updateOrder: async (id: number, orderData: OrderRequest): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar pedido');
    }

    return response.json();
  },

  // Deletar pedido
  deleteOrder: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar pedido');
    }
  },
};
