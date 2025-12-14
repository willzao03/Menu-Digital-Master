import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAlcoholic?: boolean;
}

export const ProductCard = ({ id, name, description, price, image, isAlcoholic }: ProductCardProps) => {
  const { addItem } = useCart();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95">
      <div className="h-32 sm:h-40 overflow-hidden relative bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-110"
        />
        {isAlcoholic && (
          <div className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded text-xs font-bold">
            +18
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="font-bold text-sm sm:text-base mb-0.5">{name}</h3>
        <p className="text-muted-foreground text-xs mb-2 line-clamp-1">{description}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg sm:text-xl font-bold text-primary">
            R$ {price.toFixed(2)}
          </span>
          <Button
            size="icon"
            onClick={() => addItem({ id, name, price, image, isAlcoholic })}
            className="rounded-full h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
