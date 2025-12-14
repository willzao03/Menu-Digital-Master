import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define valid products with prices (server-side validation)
const MENU_ITEMS = [
  { id: "burger", name: "Burger Clássico", price: 25.90, isAlcoholic: false },
  { id: "fries", name: "Batata Frita", price: 12.90, isAlcoholic: false },
  { id: "drink", name: "Refrigerante", price: 8.90, isAlcoholic: false },
  { id: "dessert", name: "Sobremesa", price: 15.90, isAlcoholic: false },
  { id: "beer", name: "Cerveja", price: 9.90, isAlcoholic: true },
];

// Input validation schema
const orderSchema = z.object({
  customerName: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  customerAge: z.number().int().min(1, "Idade inválida").max(150, "Idade inválida"),
  tableNumber: z.number().int().min(1, "Número da mesa inválido").max(999, "Número da mesa inválido"),
  items: z.array(z.object({
    id: z.string(),
    name: z.string().max(200),
    price: z.number().positive(),
    quantity: z.number().int().positive().max(99),
    isAlcoholic: z.boolean().optional(),
  })).min(1, "Carrinho vazio"),
  total: z.number().positive(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    
    // Validate input with zod
    const validationResult = orderSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: "Dados inválidos", details: validationResult.error.issues }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { customerName, customerAge, tableNumber, items, total } = validationResult.data;

    // Validate items against menu and recalculate total server-side
    let calculatedTotal = 0;
    for (const item of items) {
      const menuItem = MENU_ITEMS.find(m => m.id === item.id);
      if (!menuItem) {
        throw new Error(`Item inválido: ${item.id}`);
      }
      // Validate price matches menu price
      if (Math.abs(item.price - menuItem.price) > 0.01) {
        throw new Error(`Preço inválido para ${item.name}`);
      }
      calculatedTotal += menuItem.price * item.quantity;
    }

    // Validate total matches calculated total
    if (Math.abs(total - calculatedTotal) > 0.01) {
      throw new Error("Total do pedido não corresponde aos itens");
    }

    // Age validation for alcoholic items
    if (customerAge < 18) {
      const hasAlcoholicItems = items.some((item) => {
        const menuItem = MENU_ITEMS.find(m => m.id === item.id);
        return menuItem?.isAlcoholic;
      });
      if (hasAlcoholicItems) {
        throw new Error("Menores de 18 anos não podem pedir bebidas alcoólicas");
      }
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Initialize Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Generate cryptographically secure token
    const token = crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.get("origin")}/order/${token}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        token,
        customer_name: customerName,
        customer_age: customerAge.toString(),
        table_number: tableNumber.toString(),
      },
    });

    // Save order to database
    const { data: orderData, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        token,
        customer_name: customerName,
        customer_age: customerAge,
        table_number: tableNumber,
        total,
        payment_status: "pending",
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error("Failed to create order");
    }

    // Save order items
    const orderItems = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      is_alcoholic: item.isAlcoholic || false,
    }));

    const { error: itemsError } = await supabaseClient
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      throw new Error("Failed to create order items");
    }

    return new Response(
      JSON.stringify({ 
        url: session.url,
        token,
        orderId: orderData.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    // Log error without sensitive details
    console.error("Payment processing failed:", error instanceof Error ? error.message : "Unknown error");
    
    const errorMessage = error instanceof Error ? error.message : 'Erro ao processar pagamento';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
