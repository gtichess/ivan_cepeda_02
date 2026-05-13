/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
import sheetsServiceOrder from "~/services/sheetsServiceOrder";
import { getRealJid } from "~/utils/whatsapp-utils";
import { initialButtonFlow } from "./initialButtonFlow";

/**
 * Processes the order and saves each product to the sheet service.
 * @param ctx - The context object from the bot framework.
 * @param state - The state object for updating and retrieving state.
 * @param flowDynamic - Function to send dynamic messages.
 * @param gotoFlow - Function to change flow.
 * @param provider - Provider object to get order details.
 * @param orderUserCheckerFlow - The flow to go to after processing.
 * @returns {Promise<any>} - Returns the result of gotoFlow or flowDynamic.
 */
export async function processOrder(ctx, { state, flowDynamic, gotoFlow, provider }, orderUserCheckerFlow) {
    try {
        const orderId = ctx.message.orderMessage.orderId;
        const orderToken = ctx.message.orderMessage.token;
        const productOrder = await provider.vendor.getOrderDetails(orderId, orderToken);
        const orderLenght = productOrder.products.length;
        const order = ctx.body.replace('_event_order__', '');
        await state.update({ order: order });
        await state.update({ totalOrder: Number(productOrder.price.total) });

        const phone = getRealJid(ctx);
        console.log('Real JID in processOrder.ts:', phone);
        let totalOfItems = 0; // Track total quantity of all products
        for (let i = 0; i < orderLenght; i++) {
            console.log(orderLenght, i)
            const tempOrder = state.get('order');
            const order = tempOrder ? String(tempOrder).slice(0, 5) : "";
            const user = phone;
            const productId = productOrder.products[i].id;
            const productName = productOrder.products[i].name;
            const productQuantity = productOrder.products[i].quantity;
            const productPrice = Number(productOrder.products[i].price) / 1000; // Convert to number and divide by 1000
            const totalOrder = 0;
            const totalItems = 0; // Total number of different products in the order
            const observation = '---';
            const dateObj = new Date(new Date().getTime() - 5 * 60 * 60 * 1000);
            const dayOfWeek = dateObj.toLocaleString('es-ES', { weekday: 'short' });
            const date = `${dayOfWeek}, ${dateObj.toLocaleString('es-ES')}`;
            // If deliveryDate is needed, define it above; otherwise, remove it from the arguments:
            const deliveryDate = '---';
            const orderDate = new Date(new Date().getTime() - 5 * 60 * 60 * 1000).toISOString(); // Adjust time zone 5 hours earlier
            const address_delivery_charge = 0; // Placeholder value; replace with actual logic if needed
            const empaquetagem = '---'; // Placeholder value; replace with actual logic if needed
            console.log(productName)
            await sheetsServiceOrder.createOrder(order, user, productId, productName, productQuantity, productPrice, totalOrder, observation, orderDate, totalItems, deliveryDate, address_delivery_charge, empaquetagem);
            totalOfItems += productQuantity; // Sum each product quantity
            await sleep(1000); // Slow down by xxx ms per iteration            
            // Show '...' message every 2 seconds
            const carga = Math.round((i + 1) / orderLenght * 100);

            // Show carga only half of the times (50% chance)
            if (Math.random() < 0.05) {
                await flowDynamic(`...${carga}%`);
            }

        }
        await state.update({ totalOfItems: totalOfItems });

        await state.update({ orderLength: Number(productOrder.products.length) });
        await state.update({ totalOfItems }); // Store total quantity in state
        // console.log(orderId)
        return gotoFlow(orderUserCheckerFlow);

    }
    catch (error) {
        console.error("Hubo un error en el registro de un dato:", error);
        return await flowDynamic("Lo sentimos ☹️, ocurrió un error al registrar tu pedido. Por favor intenta nuevamente más tarde.");
        return gotoFlow(initialButtonFlow);
    }
}
