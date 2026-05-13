import { addKeyword, EVENTS } from "@builderbot/bot";
import { initialButtonFlow } from "./initialButtonFlow";
import { faqFlow } from "./faqFlow";
import { cateringFlow } from "./cateringFlow";
import { orderFlow } from "./orderFlow";
import { checkPaymentFlow } from "./checkPaymentFlow";
import { commonActionFlow } from "./commonActionFlow";
import { getDeliveryDate } from "../utils/deliveryDate";
import { getRealJid } from "~/utils/whatsapp-utils";

const guideToShopFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, ctxFn) => {

        const phone = ctxFn.state.get("phone");
        const deliveryDate = getDeliveryDate(new Date(Date.now() - 5 * 60 * 60 * 1000));

        const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
        await ctxFn.provider.sendText(phoneWithWhatsApp, "PractiFood es un servicio de alimentos y comidas preparadas (almuerzos, cenas, snacks), listas para consumir, empacadas al vacío, de venta online y entrega a domicilio de manera programada (no inmediata).\n\nEstoy aquí para ayudarte con cualquier consulta sobre PractiFood.\n¿Tienes alguna pregunta sobre nuestros menús o productos?\n🙂 🍽 Si estás listo para hacer tu pedido, haz clic aquí:\nhttps://wa.me/c/573117038736." +
            '\n\nMarca 0️⃣ para volver al menú principal de opciones.');

        await ctxFn.provider.sendText(phoneWithWhatsApp, `_Recuerda: si pides hoy llegará *${deliveryDate}*._`);
    })
    .addAction({ capture: true }, async (ctx, ctxFn) => {
        if (ctx.body === "0") {
            return ctxFn.gotoFlow(initialButtonFlow);
        } else if (ctx.body && ctx.body.includes('_event_order')) {
            return ctxFn.gotoFlow(orderFlow);
        } else if (ctx.body && ctx.body.includes('_event_media')) {
            return ctxFn.gotoFlow(checkPaymentFlow);
        } else if (ctx.body && ctx.body.includes('_event_document')) {
            return ctxFn.gotoFlow(checkPaymentFlow);
        } else {
            return ctxFn.gotoFlow(faqFlow);
        }
    })




export { guideToShopFlow };