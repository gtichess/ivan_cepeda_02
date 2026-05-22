import { addKeyword, EVENTS } from "@builderbot/bot";
import { initialButtonFlow } from "./initialButtonFlow";

import { getRealJid } from "~/utils/whatsapp-utils";


const checkPaymentFlow = addKeyword([EVENTS.MEDIA, EVENTS.ACTION, EVENTS.DOCUMENT])
  .addAction({ capture: false }, async (ctx, ctxFn) => {
    const input = ctx.body
    const phone = getRealJid(ctx)
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    if (input.includes("_event_media") || input.includes("_event_document")) {
      await ctxFn.provider.sendText(phoneWithWhatsApp, 'Este sistema no está posibilitado para recibir archivos.\nMarca 0️⃣ para volver al menú principal.');
      // await ctxFn.flowDynamic('Gracias... procesaremos tu documento');
    }
  }
  )

  .addAction({ capture: true }, async (ctx, ctxFn) => {
    if (ctx.body === "0") {
      return ctxFn.gotoFlow(initialButtonFlow);
    } else {
      return ctxFn.gotoFlow(initialButtonFlow);
    }
  })

export { checkPaymentFlow };