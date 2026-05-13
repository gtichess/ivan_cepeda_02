import { addKeyword, EVENTS, utils } from "@builderbot/bot";
import { config } from "../config";
import { numberClean } from "../utils/cleanNumber";
import { getRealJid } from "~/utils/whatsapp-utils";
import { initialButtonFlow } from "./initialButtonFlow";


const ADMIN_NUMBER = config.ADMIN_PHONE;

const blackListFlow = addKeyword(EVENTS.ACTION)
    .addAction({ capture: true }, async (ctx, { flowDynamic, provider, blacklist, gotoFlow }) => {
        const phone = getRealJid(ctx);
        const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
        console.log('Admin phone:', ADMIN_NUMBER);
        if (phone === ADMIN_NUMBER) {
            const toMute = numberClean(ctx.body) //Mute +34000000 message incoming
            const check = blacklist.checkIf(toMute)
            if (!check) {
                blacklist.add(toMute)
                await provider.sendText(phoneWithWhatsApp, `❌ ${toMute} muted`)
                // await flowDynamic(`❌ ${toMute} muted`)
                return gotoFlow(initialButtonFlow);
            }
            blacklist.remove(toMute)
            await provider.sendText(phoneWithWhatsApp, `🆗 ${toMute} unmuted`)
            // await flowDynamic(`🆗 ${toMute} unmuted`)
            return gotoFlow(initialButtonFlow);
        }
    })
    .addAction({ capture: false }, async (ctx, { flowDynamic, provider, blacklist, gotoFlow }) => {
        const phone = getRealJid(ctx);
        return gotoFlow(initialButtonFlow);
    })

export { blackListFlow };