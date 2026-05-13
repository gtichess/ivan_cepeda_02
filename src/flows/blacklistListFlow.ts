import { addKeyword, EVENTS, utils } from "@builderbot/bot";
import { config } from "../config";
import { get } from "http";
import { getRealJid } from "~/utils/whatsapp-utils";
import sheetsService from "~/services/sheetsService";
import { initialButtonFlow } from "./initialButtonFlow";


const ADMIN_NUMBER = config.ADMIN_PHONE;

const blackListFListlow = addKeyword(EVENTS.ACTION)

    .addAction({ capture: false },
        async (ctx, { provider, flowDynamic, blacklist, endFlow, gotoFlow }) => {
            const phone = getRealJid(ctx);
            if (phone === ADMIN_NUMBER) {
                const blocked = blacklist.getList();
                console.log('Blocked IDs:', blocked);
                const resultArray = await Promise.all(blocked.map(async (id, index) => {
                    const visitorName = await sheetsService.getVisitorName(id);
                    return `id ${index + 1}: ${id} ${visitorName ? `(${visitorName})` : ''}`;
                }));
                const result = resultArray.join('\n');
                const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
                await provider.sendText(phoneWithWhatsApp, `*LOS SIGUIENTES SON LOS USUARIOS BLOQUEADOS*\n${result}`)
            }

            return gotoFlow(initialButtonFlow);
        }


    )
    .addAction({ capture: false }, async (ctx, { flowDynamic, provider, blacklist, gotoFlow }) => {
        const phone = getRealJid(ctx);
        return gotoFlow(initialButtonFlow);
    })

export { blackListFListlow };