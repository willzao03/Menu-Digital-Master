-- Remove the permissive policies we just created
DROP POLICY IF EXISTS "Orders viewable by token only" ON public.orders;
DROP POLICY IF EXISTS "Order items viewable by token only" ON public.order_items;

-- Create restrictive policies that deny all direct SELECT access
-- This forces all reads to go through edge functions
CREATE POLICY "Deny direct order access" 
ON public.orders 
FOR SELECT 
USING (false);

CREATE POLICY "Deny direct order items access" 
ON public.order_items 
FOR SELECT 
USING (false);