import { addKeyword, EVENTS } from "@builderbot/bot";
import { mainFlow } from "./serviceFlow";
import { cateringFlow } from "./cateringFlow";
import { faqFlow } from "./faqFlow";
import sheetsService from "../services/sheetsService";
import { send } from "process";
import { getDeliveryDate } from "../utils/deliveryDate";
import { getDeliveryMessage } from "../utils/deliveryMessage";
import { guideToShopFlow } from "./guideToShopFlow";
import { orderFlow } from "./orderFlow";
import { checkPaymentFlow } from "./checkPaymentFlow";
import { commonActionFlow } from "./commonActionFlow";
import { get } from "http";
import { getRealJid } from "../utils/whatsapp-utils";
import { BaileysProvider } from "@builderbot/provider-baileys";
import { from } from "form-data";
import { blackListFListlow } from "./blacklistListFlow";
import { blackListFlow } from "./blacklistFlow";
import { voice_note_flow } from "./voice_note_flow";

const today = new Date();
const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

/** 
* INICIO DEL FLOW INITIALBUTTONFLOW DONDE TOOOODO DEBE COMENZAR
*/
const initialButtonFlow = addKeyword<BaileysProvider>([EVENTS.WELCOME, EVENTS.ACTION])
    .addAction(async (ctx, ctxFn) => {
        const phone = getRealJid(ctx)
        ctxFn.state.update({ phone: phone });
        const currentUser = phone || "unknown_user";
        const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
        console.log("Current user phone number in initialButtonFlow :", currentUser);
        const isUser = (await sheetsService.userExists(currentUser)) || false;
        const deliveryDate = getDeliveryDate(new Date(Date.now() - 5 * 60 * 60 * 1000));
        console.log(phoneWithWhatsApp);
        console.log("Is user registered?:", isUser);
        console.log("Calculated delivery date (-5h):", deliveryDate);
        if (!isUser) {
            // await ctx.flowDynamic(`Tus datos serán protegidos y no serán compartidos con terceros`, { from: phone });
            console.log('Registering new user:', phone, ctx.pushName);
            await ctxFn.provider.sendText(phoneWithWhatsApp, `¡Bienvenido a La Casa - Soluciones Gastronómicas! 🍽✨\nSoy un asistente virtual, por favor elige la opción que mejor se adapte a tu necesidad:\n\n🅰 PractiFood – Comida lista para consumir, empacada al vacío, para tu día a día.\n¿Tienes dudas o quieres hacer un pedido?\n👉 Escribe: A\n\n🅱 Catering – Servicio de alimentación para eventos sociales y corporativos.\n¿Necesitas cotizar o conocer más detalles?\n👉 Escribe: B`);
            await sheetsService.createUser(currentUser, ctx.pushName);
            // return ctxFn.gotoFlow(commonActionFlow);
        } else {
            await ctxFn.provider.sendText(phoneWithWhatsApp, `✨Soy un asistente virtual, por favor elige la opción que mejor se adapte a tu necesidad:\n🅰 PractiFood – Comida lista para consumir, empacada al vacío, para tu día a día.\n¿Tienes dudas o quieres hacer un pedido?\n👉 Escribe: A\n\n🅱 Catering – Servicio de alimentación para eventos sociales y corporativos.\n¿Necesitas cotizar o conocer más detalles?\n👉 Escribe: B`);
            // return ctxFn.gotoFlow(commonActionFlow);
        }
    })
    .addAction({ capture: true }, async (ctx, ctxFn) => {
        const phone = ctxFn.state.get("phone");
        const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
        if (ctx.body && ctx.body.trim().toLowerCase() === "b") {
            return ctxFn.gotoFlow(cateringFlow);
        } else if (ctx.body && ctx.body.trim().toLowerCase() === "a") {
            return ctxFn.gotoFlow(guideToShopFlow);
        } else if (ctx.body && ctx.body.trim().toLowerCase() === "c") {
            return ctxFn.gotoFlow(cateringFlow);
        } else if (ctx.body && ctx.body.includes('_event_order')) {
            return ctxFn.gotoFlow(orderFlow);
        } else if (ctx.body && ctx.body.includes('_event_media')) {
            return ctxFn.gotoFlow(checkPaymentFlow);
        } else if (ctx.body && ctx.body.includes('_event_document')) {
            return ctxFn.gotoFlow(checkPaymentFlow);
        } else if (ctx.body && ctx.body.includes('_event_voice_note')) {
            return ctxFn.gotoFlow(voice_note_flow);

        } else if (ctx.body && ctx.body.trim().toLowerCase() === 'black') {
            return ctxFn.gotoFlow(blackListFListlow);
        } else if (ctx.body && ctx.body.trim().toLocaleLowerCase() === 'mute') {
            await ctxFn.provider.sendText(phoneWithWhatsApp, `🚫 *Para silenciar a un usuario:*\nEnvía \`mute\` seguido del número de teléfono.\n📵 *Ejemplo:* \`mute 573001234567\``);
            return ctxFn.gotoFlow(blackListFlow);
        }

        await ctxFn.provider.sendText(phoneWithWhatsApp, `Por favor, responde con A (Practifood) ó B (Catering).`)
        return ctxFn.gotoFlow(initialButtonFlow, 1);
    })
    .addAction({ capture: false }, async (ctx, { flowDynamic, provider, blacklist, gotoFlow }) => {
        return gotoFlow(initialButtonFlow);
    })
export { initialButtonFlow };