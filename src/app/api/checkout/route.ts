import { NextResponse, NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CartItem } from '@/context/cart-context';

// Garante que esta rota seja tratada como dinâmica
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cartItems = body.cartItems as CartItem[];

    if (!cartItems || cartItems.length === 0) {
      return new NextResponse('Itens do carrinho não encontrados.', { status: 400 });
    }

    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Preço em centavos
      },
      quantity: item.quantity,
    }));

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix', 'boleto'],
      line_items,
      mode: 'payment',
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      billing_address_collection: 'auto',
      tax_id_collection: {
        enabled: true,
      },
      payment_method_options: {
        boleto: {
          expires_after_days: 3,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[STRIPE_CHECKOUT_ERROR]', error);
    return new NextResponse(`Erro interno do servidor: ${error.message}`, { status: 500 });
  }
}
