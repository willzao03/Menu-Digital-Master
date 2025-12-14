-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_age INTEGER NOT NULL CHECK (customer_age > 0 AND customer_age <= 150),
  table_number INTEGER NOT NULL CHECK (table_number > 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL CHECK (product_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  is_alcoholic BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (anyone can view orders by token)
CREATE POLICY "Anyone can view orders"
  ON public.orders
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON public.order_items
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert order items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_orders_token ON public.orders(token);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);