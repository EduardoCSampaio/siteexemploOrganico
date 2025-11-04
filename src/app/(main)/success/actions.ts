'use server';

import { stripe } from '@/lib/stripe';
import { addDoc, collection, serverTimestamp, doc } from 'firebase/firestore';
import { getSdks } from '@/firebase';

export async function saveOrderAction(sessionId: string, userId: string) {
    if (!sessionId || !userId) {
        throw new Error("ID da sessão ou ID do usuário ausente.");
    }

    const { firestore } = getSdks();

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
        };

        const ordersRef = collection(firestore, 'users', userId, 'orders');
        const orderDocRef = await addDoc(ordersRef, orderData);

        const orderItemsRef = collection(orderDocRef, 'order_items');
        for (const item of lineItems) {
            const product = item.price?.product as any; // 'any' to access Stripe object properties
            if (item.quantity) {
                 await addDoc(orderItemsRef, {
                    name: product.name,
                    quantity: item.quantity,
                    price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
                    // Garante que a imagem seja extraída corretamente
                    image: product.images && product.images.length > 0 ? product.images[0] : null,
                });
            }
        }

        return { success: true, orderId: orderDocRef.id };

    } catch (error: any) {
        console.error(`Erro ao salvar pedido para sessão ${sessionId}:`, error);
        throw new Error(`Falha ao salvar pedido no banco de dados: ${error.message}`);
    }
}
