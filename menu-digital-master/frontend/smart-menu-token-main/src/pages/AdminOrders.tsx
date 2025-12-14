import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { orderApi, Order } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Erro ao carregar pedidos",
        description: "Não foi possível carregar a lista de pedidos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este pedido?')) {
      return;
    }

    try {
      await orderApi.deleteOrder(id);
      toast({
        title: "Pedido deletado",
        description: "O pedido foi removido com sucesso",
      });
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o pedido",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md w-full">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Carregando pedidos...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-9 w-9 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold">Todos os Pedidos</h1>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Pedido #{order.token}</h3>
                    <p className="text-sm text-muted-foreground">ID: {order.id}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(order.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Cliente</p>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mesa</p>
                    <p className="font-semibold">{order.tableNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-semibold">{order.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-semibold text-primary">R$ {order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-semibold mb-2">Itens:</p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
