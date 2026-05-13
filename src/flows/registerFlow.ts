import { addKeyword, EVENTS } from "@builderbot/bot";
import sheetsServiceOrder from "~/services/sheetsServiceOrder";
import { orderFinalFlow } from "./orderFinalFlow"




import { getRealJid } from "~/utils/whatsapp-utils";









const registerFlow = addKeyword(EVENTS.ACTION)
  .addAnswer("Por favor, proporciona tu *nombre*:", { capture: true }, async (ctx, ctxFn) => {
    await ctxFn.state.update({ param1: ctx.body });
    // await ctxFn.flowDynamic("Ahora, proporciona tu mejor *email*:");
  })
  .addAction({ capture: false }, async (ctx, ctxFn) => {
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // if (!emailRegex.test(ctx.body)) {
    // return ctxFn.fallBack("Por favor, ingresa un correo electrónico válido. 📧");
    // }
    // await ctxFn.state.update({ param2: ctx.body });
    await ctxFn.flowDynamic("Proporciona la *dirección de envío*:");
  })








  .addAction({ capture: true }, async (ctx, ctxFn) => {
    await ctxFn.state.update({ param3: ctx.body });
    const phone = getRealJid(ctx);
    console.log('Real JID:', phone);
    const user = phone
    // console.log(user)
    const name = ctxFn.state.get('param1');
    const email = ctxFn.state.get('no_disponible');
    // const email = ctxFn.state.get('param2');
    const address = ctxFn.state.get('param3');
    const { flowDynamic, gotoFlow } = ctxFn;
    await sheetsServiceOrder.storeUserInfo(user, name, email, address);
    await flowDynamic("Tus datos han sido registrados correctamente. ✅\n");
    return gotoFlow(orderFinalFlow)
  });

  export { registerFlow };