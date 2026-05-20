import { addKeyword, EVENTS } from "@builderbot/bot";
import { initialButtonFlow } from "./initialButtonFlow";

import { getRealJid } from "~/utils/whatsapp-utils";


const voice_note_flow = addKeyword([EVENTS.VOICE_NOTE, EVENTS.ACTION])
  .addAction({ capture: false }, async (ctx, ctxFn) => {
    const input = ctx.body
    const phone = getRealJid(ctx)
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    if (input.includes("_event_voice_note")) {
      await ctxFn.provider.sendText(phoneWithWhatsApp, 'Ten presente que este chat NO recibe notas de voz, ni videos.');
      // await ctxFn.flowDynamic('Ten presente que este chat NO recibe notas de voz, ni videos.');
    }
  }
  )
  .addAction({ capture: false }, async (ctx, { flowDynamic, provider, blacklist, gotoFlow }) => {
    const phone = getRealJid(ctx);
    return gotoFlow(initialButtonFlow);
  })


export { voice_note_flow };