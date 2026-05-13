import { addKeyword, EVENTS } from "@builderbot/bot";
import { registerFlow } from "./registerFlow";
import sheetsService from "../services/sheetsService";
// import { DetectIntention } from "./intention.flow";
import { initialButtonFlow } from "./initialButtonFlow";
import { faqFlow } from "./faqFlow";
import { cateringFlow } from "./cateringFlow";

import { orderFlow } from "./orderFlow";
import { checkPaymentFlow } from "./checkPaymentFlow";

const mainFlow = addKeyword(
  //[
  //EVENTS.WELCOME, // This event is triggered when a user starts a conversation with the bot
  //EVENTS.VOICE_NOTE,  // This event is triggered when a user sends a voice note
  //EVENTS.MEDIA, // This event is triggered when a user sends a media file
  //EVENTS.DOCUMENT, // This event is triggered when a user sends a document
  //]
  'service'
)
  .addAction(async (ctx, ctxFn) => {
    await ctxFn.flowDynamic(" Esto es un módulo de servicio muy útil a módulo servicio");
  }

  )
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    // if (ctx.body.includes("_event_")) {
    //   console.log('ctx.body:', ctx.body); // Show ctx.body for debugging
    //   await ctxFn.flowDynamic(`Mensaje recibido: ${ctx.body}`); // Show ctx.body to client
    //   return ctxFn.endFlow(
    //     `Disculpa... Por favor inténtalo de nuevo porque no conseguí capturar tu orden de pedido.`
    //   );
    // }
    // Check if the user has already been greeted in this session
    if (!ctxFn.state.get("serviceUserGreeted")) {
      ctxFn.state.update({ serviceUserGreeted: true });
      // Record user in 'noUsers' sheet
      await ctxFn.flowDynamic("Llegó hasta justo antes del gotoflof(initialButtonFlow)");
      return ctxFn.gotoFlow(initialButtonFlow);
    }
  }
  )
  // .addAction({ capture: true }, async (ctx, ctxFn) => {
  //   console.log('User selected option in mainFlow:', ctx.body);
  //   if (ctx.body && ctx.body.trim().toLowerCase() === "b") {
  //     return ctxFn.gotoFlow(cateringFlow);
  //   } else if (ctx.body && ctx.body.trim().toLowerCase() === "a") {
  //     return ctxFn.gotoFlow(guideToShopFlow);
  //   } else if (ctx.body && ctx.body.includes('_event_order')) {
  //     return ctxFn.gotoFlow(orderFlow);
  //   } else if (ctx.body && ctx.body.includes('_event_media')) {
  //     return ctxFn.gotoFlow(checkPaymentFlow);
  //   }
  //   return ctxFn.gotoFlow(faqFlow);
  // })


export { mainFlow };
