import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const CartDrawer = () => {
  const { items, removeItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const cartButton = (
    <Button size="icon" variant="outline" className="relative">
      <ShoppingBag className="h-5 w-5" />
      {items.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold">
          {items.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      )}
    </Button>
  );

  const cartContent = (
    <div className="mt-8 space-y-4 max-h-[70vh] overflow-y-auto px-4">
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Seu carrinho está vazio
        </p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 items-center pb-4 border-b">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                <p className="text-primary font-bold">
                  R$ {item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-full"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          <div className="border-t pt-4 mt-4 sticky bottom-0 bg-background pb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {total.toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              Finalizar Pedido
            </Button>
          </div>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {cartButton}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Seu Carrinho</DrawerTitle>
          </DrawerHeader>
          {cartContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {cartButton}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Seu Carrinho</SheetTitle>
        </SheetHeader>
        {cartContent}
      </SheetContent>
    </Sheet>
  );
};