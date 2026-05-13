import { addKeyword, EVENTS } from "@builderbot/bot";
import sheetsServiceOrder from "~/services/sheetsServiceOrder";
import { processOrder } from "./processOrder";
import { orderUserCheckerFlow } from "./orderUserCheckerFlow";
import { registerFlow } from "./registerFlow";
import sheetsService from "../services/sheetsService";
import { initialButtonFlow } from "./initialButtonFlow";
import { getRealJid } from "~/utils/whatsapp-utils";

const orderFlow = addKeyword([EVENTS.ORDER, EVENTS.ACTION])

  .addAction(async (ctx, ctxFn) => {
    const phone = getRealJid(ctx)
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    // await ctxFn.flowDynamic(`Tu pedido está siendo procesado\nPor favor NO ESCRIBAS NADA MÁS y espera un momento...⌛ `);
    await ctxFn.provider.sendText(phoneWithWhatsApp, `Tu pedido está siendo procesado\nPor favor NO ESCRIBAS NADA MÁS y espera un momento...⌛ `);
  })
  .addAnswer('', null, async (ctx, { state, flowDynamic, gotoFlow, provider }) => {
    return processOrder(ctx, { state, flowDynamic, gotoFlow, provider }, orderUserCheckerFlow);
  });
export { orderFlow };




