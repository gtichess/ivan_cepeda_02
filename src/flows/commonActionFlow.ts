import { cateringFlow } from "./cateringFlow";
import { guideToShopFlow } from "./guideToShopFlow";
import { orderFlow } from "./orderFlow";
import { checkPaymentFlow } from "./checkPaymentFlow";
import { faqFlow } from "./faqFlow";
import { voice_note_flow } from "./voice_note_flow";
import { addKeyword, EVENTS } from "@builderbot/bot";
import { initialButtonFlow } from "./initialButtonFlow";

const commonActionFlow = addKeyword([EVENTS.ACTION])
    .addAction({ capture: true }, async (ctx, ctxFn) => {
        // console.log("comefromfaq_input_commonActionFlow", ctxFn.state.get("comefromfaq"))
        // console.log('User selected option commonActionFlow:', ctx.body);
        // Outer if block added as requested
        // if (ctxFn.state.get('filterPassed') === false)  // Checks if filterPassed is true
        // ctxFn.state.update({ comefromfaq: false })
        const phone = ctxFn.state.get("phone");
        const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
        await ctxFn.provider.sendText(phoneWithWhatsApp, '...')
        // await ctxFn.flowDynamic([{ body: "..." }])
        if (ctx.body && ctx.body.trim().toLowerCase() === "b") {
            return ctxFn.gotoFlow(cateringFlow);
        } else if (ctx.body && ctx.body.trim().toLowerCase() === "a") {
            return ctxFn.gotoFlow(guideToShopFlow);
        } else if (ctx.body && ctx.body.includes('_event_order')) {
            return ctxFn.gotoFlow(orderFlow);
        } else if (ctx.body && ctx.body.includes('_event_media')) {
            return ctxFn.gotoFlow(checkPaymentFlow);
        } else if (ctx.body && ctx.body.includes('_event_document')) {
            return ctxFn.gotoFlow(checkPaymentFlow);
        } else if (ctx.body && ctx.body.includes('_event_voice_note')) {
            return ctxFn.gotoFlow(voice_note_flow);
        }
         return ctxFn.gotoFlow(faqFlow);
     
    }
        // Optionally handle else case here
    )

export { commonActionFlow };