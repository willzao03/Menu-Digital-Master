import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, Clock, CheckCircle2, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { orderApi, Order } from '@/services/api';

export default function TrackOrder() {
  const [token, setToken] = useState('');
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim().length < 3) {
      toast({
        title: "Token inválido",
        description: "Por favor, digite um token válido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const order = await orderApi.getOrderByToken(token.trim().toUpperCase());
      setOrderData(order);
      
      toast({
        title: "Pedido encontrado!",
        description: `Pedido #${order.token} carregado com sucesso`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Pedido não encontrado",
        description: "Verifique o token e tente novamente",
        variant: "destructive",
      });
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-9 w-9 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold">Acompanhar Pedido</h1>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl">
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
          <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="token" className="text-sm">Digite o token do seu pedido</Label>
              <div className="flex gap-2">
                <Input
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  placeholder="Ex: ABC123"
                  className="uppercase h-11 sm:h-10 text-center text-lg sm:text-base tracking-widest"
                />
                <Button type="submit" disabled={loading} className="h-11 sm:h-10 px-4 sm:px-3">
                  {loading ? 'Buscando...' : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {orderData && (
          <Card className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Pedido #{orderData.token}</h2>
                <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                  <p>Cliente: {orderData.customerName}</p>
                  <p>Mesa: {orderData.tableNumber}</p>
                  <p className="text-base sm:text-lg font-bold text-primary mt-2">
                    Total: R$ {orderData.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <h3 className="font-semibold text-sm sm:text-base">Itens do Pedido:</h3>
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 sm:p-3 bg-muted rounded-lg text-sm sm:text-base">
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="font-medium break-words">{item.quantity}x {item.name}</span>
                    </div>
                    <span className="font-semibold flex-shrink-0">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/10 rounded-lg border-2 border-secondary">
                  <div className="bg-secondary text-secondary-foreground p-1.5 sm:p-2 rounded-full flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base">Pedido Confirmado</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Status: {orderData.status}
                    </p>
                  </div>
                </div>

                {orderData.status === 'CONFIRMADO' && (
                  <>
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-primary/10 rounded-lg border-2 border-primary">
                      <div className="bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-full flex-shrink-0">
                        <ChefHat className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base">Em Preparação</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Estamos preparando seu pedido
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted rounded-lg border-2 border-border opacity-50">
                      <div className="bg-muted-foreground/20 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base">Pronto para Retirada</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Aguardando...
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
