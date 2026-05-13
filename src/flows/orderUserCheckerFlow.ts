import { addKeyword, EVENTS } from "@builderbot/bot";
import sheetsServiceOrder from "~/services/sheetsServiceOrder";
import { registerFlow } from "./registerFlow";
import { orderFinalFlow } from "./orderFinalFlow";

import { getRealJid } from "~/utils/whatsapp-utils";

const orderUserCheckerFlow = addKeyword([EVENTS.ACTION])
  // .addAnswer(`Pedido cargado completamente ✅`)
  .addAction(async (ctx, ctxFn) => {
    // await ctxFn.flowDynamic(`... Pedido Cargado 100 % ${carga}`)
    const phone = getRealJid(ctx);
    console.log('Real JID in orderUserCheckerFlow.ts :', phone);
    const user = phone;
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp, `Pedido cargado completamente ✅`);
  })
  .addAnswer('', null, async (ctx, ctxFn): Promise<void> => {
    // await ctxFn.flowDynamic(`... Pedido Cargado 100 % ${carga}`)
    const phone = getRealJid(ctx);
    console.log('Real JID in orderUserCheckerFlow.ts :', phone);
    const user = phone;
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    const userExists = await sheetsServiceOrder.checkUserExists(user);
    if (userExists) {
      const userInfo = await sheetsServiceOrder.getUserInfo(user);
      await ctxFn.provider.sendText(phoneWithWhatsApp, `Tus datos actuales son: \nNombre: *${userInfo.name}*\ny tu dirección de envío: \n*${userInfo.address}*`);
      await ctxFn.gotoFlow(orderFinalFlow);
    } else {
      await ctxFn.provider.sendText(phoneWithWhatsApp, "No estás registrado actualmente.\n...\nDame algunos datos para completar tu pedido...⏬");
      
      await ctxFn.gotoFlow(registerFlow);
    }
  });

export { orderUserCheckerFlow };
