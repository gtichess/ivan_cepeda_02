import { addKeyword, EVENTS } from "@builderbot/bot";
import { gameFlow } from "./gameFlow";
import sheetsService from "../services/sheetsService";
import { getDeliveryDate } from "../utils/deliveryDate";
import { getRealJid } from "../utils/whatsapp-utils";
import { BaileysProvider } from "@builderbot/provider-baileys";
import { blackListFListlow } from "./blacklistListFlow";
import { blackListFlow } from "./blacklistFlow";
import { voice_note_flow } from "./voice_note_flow";
import {
    getInitialButtonNewUserMessage,
    getInitialButtonReturningMessage,
    INITIAL_BUTTON_WELCOME_MESSAGE,
} from "../consts/initialButtonMessages";
import { checkPaymentFlow } from "./checkPaymentFlow";

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
            console.log('Registering new user:', phone, ctx.pushName);
            await ctxFn.provider.sendText(phoneWithWhatsApp, getInitialButtonNewUserMessage(ctx.pushName));
            await ctxFn.provider.sendText(phoneWithWhatsApp, INITIAL_BUTTON_WELCOME_MESSAGE);
            await sheetsService.createUser(currentUser, ctx.pushName);
        } else {
            await ctxFn.provider.sendText(phoneWithWhatsApp, getInitialButtonReturningMessage(ctx.pushName));
        }
    })
    .addAction({ capture: true }, async (ctx, ctxFn) => {
        const phone = ctxFn.state.get("phone");
        const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
        if (ctx.body && ctx.body.trim().toLowerCase() === "juego") {
            return ctxFn.gotoFlow(gameFlow);
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
        await ctxFn.provider.sendText(phoneWithWhatsApp, "Por favor, escribe la palabra 'juego' para continuar.")
        return ctxFn.gotoFlow(initialButtonFlow, 1);
    })
    .addAction({ capture: false }, async (ctx, { flowDynamic, provider, blacklist, gotoFlow }) => {
        return gotoFlow(initialButtonFlow);
    })
export { initialButtonFlow };