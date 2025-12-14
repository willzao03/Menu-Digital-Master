import { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import burgerImg from '@/assets/burger.jpg';
import drinkImg from '@/assets/drink.jpg';
import dessertImg from '@/assets/dessert.jpg';
import friesImg from '@/assets/fries.jpg';
import { UtensilsCrossed, Package, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const products = {
  lanches: [
    {
      id: '1',
      name: 'X-Burger Classic',
      description: 'Hambúrguer artesanal com queijo derretido',
      price: 28.90,
      image: burgerImg,
      isAlcoholic: false,
    },
    {
      id: '2',
      name: 'X-Bacon Especial',
      description: 'Hambúrguer com bacon crocante e cheddar',
      price: 32.90,
      image: burgerImg,
      isAlcoholic: false,
    },
    {
      id: '3',
      name: 'Batata Frita',
      description: 'Porção crocante de batatas fritas',
      price: 15.90,
      image: friesImg,
      isAlcoholic: false,
    },
  ],
  bebidas: [
    {
      id: '4',
      name: 'Refrigerante Lata',
      description: 'Coca-Cola, Guaraná ou Fanta',
      price: 5.90,
      image: drinkImg,
      isAlcoholic: false,
    },
    {
      id: '5',
      name: 'Suco Natural',
      description: 'Laranja, limão ou morango',
      price: 8.90,
      image: drinkImg,
      isAlcoholic: false,
    },
    {
      id: '6',
      name: 'Cerveja Lata 350ml',
      description: 'Cerveja gelada - apenas +18 anos',
      price: 7.90,
      image: drinkImg,
      isAlcoholic: true,
    },
  ],
  sobremesas: [
    {
      id: '7',
      name: 'Bolo de Chocolate',
      description: 'Fatia generosa com cobertura cremosa',
      price: 12.90,
      image: dessertImg,
      isAlcoholic: false,
    },
    {
      id: '8',
      name: 'Brownie',
      description: 'Brownie quente com sorvete',
      price: 14.90,
      image: dessertImg,
      isAlcoholic: false,
    },
  ],
};

export default function Menu() {
  const [activeTab, setActiveTab] = useState('lanches');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h1 className="text-lg sm:text-2xl font-bold">DelíciasApp</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/admin/orders')}
              className="h-9 w-9 sm:h-10 sm:w-10"
              title="Administração"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/track')}
              className="h-9 w-9 sm:h-10 sm:w-10"
              title="Acompanhar Pedido"
            >
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <CartDrawer />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Nosso Cardápio</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Escolha seus pratos favoritos e peça direto pelo app
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-auto">
            <TabsTrigger value="lanches" className="text-xs sm:text-sm py-2">Lanches</TabsTrigger>
            <TabsTrigger value="bebidas" className="text-xs sm:text-sm py-2">Bebidas</TabsTrigger>
            <TabsTrigger value="sobremesas" className="text-xs sm:text-sm py-2">Sobremesas</TabsTrigger>
          </TabsList>

          <TabsContent value="lanches">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.lanches.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bebidas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.bebidas.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sobremesas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.sobremesas.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
