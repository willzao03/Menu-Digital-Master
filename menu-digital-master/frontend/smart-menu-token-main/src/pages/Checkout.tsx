import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { orderApi } from '@/services/api';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const hasAlcoholicItems = items.some(item => item.isAlcoholic);
  const ageNumber = parseInt(age);
  const isUnderage = age && ageNumber < 18;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome",
        variant: "destructive",
      });
      return;
    }

    if (!age || ageNumber <= 0 || ageNumber > 150) {
      toast({
        title: "Idade inválida",
        description: "Por favor, informe uma idade válida",
        variant: "destructive",
      });
      return;
    }

    if (!tableNumber || parseInt(tableNumber) <= 0) {
      toast({
        title: "Mesa inválida",
        description: "Por favor, informe o número da sua mesa",
        variant: "destructive",
      });
      return;
    }

    if (hasAlcoholicItems && ageNumber < 18) {
      toast({
        title: "Não autorizado",
        description: "Menores de 18 anos não podem pedir bebidas alcoólicas",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const order = await orderApi.createOrder({
        customerName: name.trim(),
        tableNumber: tableNumber,
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      toast({
        title: "Pedido criado!",
        description: `Seu pedido #${order.token} foi criado com sucesso`,
      });

      clearCart();
      navigate(`/order/${order.token}`);
    } catch (error: any) {
      console.error('Order error:', error);
      toast({
        title: "Erro ao criar pedido",
        description: error.message || "Ocorreu um erro ao processar seu pedido",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Carrinho vazio</h2>
          <p className="text-muted-foreground mb-6">
            Adicione itens ao carrinho antes de finalizar o pedido
          </p>
          <Button onClick={() => navigate('/')}>
            Voltar ao Cardápio
          </Button>
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
          <h1 className="text-lg sm:text-2xl font-bold">Finalizar Pedido</h1>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {hasAlcoholicItems && isUnderage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Seu carrinho contém bebidas alcoólicas. Menores de 18 anos não podem pedir estes itens.
              </AlertDescription>
            </Alert>
          )}

          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Seus Dados</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-sm">Nome completo *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="h-11 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="age" className="text-sm">Idade *</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="150"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Sua idade"
                  required
                  className="h-11 sm:h-10"
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="table" className="text-sm">Número da Mesa *</Label>
                <Input
                  id="table"
                  type="number"
                  min="1"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Ex: 5"
                  required
                  className="h-11 sm:h-10"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 sm:space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm sm:text-base">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="break-words">
                      {item.quantity}x {item.name}
                    </span>
                    {item.isAlcoholic && (
                      <span className="ml-2 text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded">
                        +18
                      </span>
                    )}
                  </div>
                  <span className="font-semibold flex-shrink-0">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between text-lg sm:text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 sm:h-11 text-base"
            disabled={isProcessing || (hasAlcoholicItems && isUnderage)}
          >
            {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
          </Button>
        </form>
      </main>
    </div>
  );
}
