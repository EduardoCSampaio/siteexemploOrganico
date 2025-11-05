'use server';

import { stripe } from '@/lib/stripe';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase'; // Alterado para importação direta

export async function saveOrderAction(sessionId: string, userId: string) {
    if (!sessionId || !userId) {
        throw new Error("ID da sessão ou ID do usuário ausente.");
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items.data.price.product'],
        });

        if (session.payment_status !== 'paid') {
            throw new Error('Pagamento não foi concluído.');
        }

        const lineItems = session.line_items?.data;
        if (!lineItems) {
            throw new Error('Itens do pedido não encontrados na sessão.');
        }

        // Mapeia os itens da linha para o formato que será salvo no Firestore
        const orderItems = lineItems.map(item => {
            const product = item.price?.product as any; // 'any' para acessar as propriedades do objeto Stripe
            return {
                name: product.name,
                quantity: item.quantity || 0,
                price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
                // Garante que a imagem seja extraída corretamente
                image: product.images && product.images.length > 0 ? product.images[0] : null,
            };
        });

        const orderData = {
            userId: userId,
            orderDate: serverTimestamp(),
            totalAmount: session.amount_total ? session.amount_total / 100 : 0,
            status: 'processing', // Status inicial
            shippingAddress: session.shipping_details ? {
                name: session.shipping_details.name,
                address: {
                    line1: session.shipping_details.address?.line1,
                    line2: session.shipping_details.address?.line2,
                    city: session.shipping_details.address?.city,
                    state: session.shipping_details.address?.state,
                    postal_code: session.shipping_details.address?.postal_code,
                    country: session.shipping_details.address?.country,
                }
            } : null,
            items: orderItems, // Salva os itens como um array dentro do pedido
        };

        const ordersRef = collection(firestore, 'users', userId, 'orders');
        const orderDocRef = await addDoc(ordersRef, orderData);

        return { success: true, orderId: orderDocRef.id };

    } catch (error: any) {
        console.error(`Erro ao salvar pedido para sessão ${sessionId}:`, error);
        throw new Error(`Falha ao salvar pedido no banco de dados: ${error.message}`);
    }
}
