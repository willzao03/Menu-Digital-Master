import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Home, Loader2 } from 'lucide-react';
import { orderApi, Order as OrderType } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export default function Order() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const orderData = await orderApi.getOrderByToken(token);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast({
          title: "Erro ao carregar pedido",
          description: "Não foi possível carregar os detalhes do pedido",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
        <Card className="p-6 sm:p-8 text-center max-w-md w-full">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Carregando pedido...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
      <Card className="p-6 sm:p-8 text-center max-w-md w-full">
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="bg-secondary/20 p-3 sm:p-4 rounded-full">
            <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-secondary" />
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Pedido Confirmado!</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          Seu pedido foi criado com sucesso
        </p>

        {order && (
          <>
            <div className="bg-muted p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                Token do seu pedido:
              </p>
              <p className="text-3xl sm:text-4xl font-bold text-primary tracking-wider">
                {order.token}
              </p>
            </div>

            <div className="bg-accent/10 border-2 border-accent rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 space-y-2">
              <p className="text-xs sm:text-sm font-semibold">
                ⚡ Guarde este token para acompanhar seu pedido
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Cliente: {order.customerName}</p>
                <p>Mesa: {order.tableNumber}</p>
                <p className="font-bold text-primary">Total: R$ {order.total.toFixed(2)}</p>
              </div>
            </div>
          </>
        )}

        <Button onClick={() => navigate('/')} className="w-full h-12 sm:h-11 text-base" size="lg">
          <Home className="mr-2 h-4 w-4" />
          Voltar ao Início
        </Button>
      </Card>
    </div>
  );
}
