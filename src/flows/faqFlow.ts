import { addKeyword, EVENTS } from "@builderbot/bot";
import aiServices from "~/services/aiServices";
import sheetsService from "~/services/sheetsService";
import { config } from "../config";
import path from "path";
import fs, { stat } from "fs";
import { initialButtonFlow } from "./initialButtonFlow";
import { getRealJid } from "~/utils/whatsapp-utils";
import { orderFlow } from "./orderFlow";
import { checkPaymentFlow } from "./checkPaymentFlow";
import { voice_note_flow } from "./voice_note_flow";

const pathPrompt = path.join(
  process.cwd(),
  "public/assets/prompts",
  "prompt_OpenAi.txt"
);
const prompt = fs.readFileSync(pathPrompt, "utf8");


export const faqFlow = addKeyword([EVENTS.ACTION])
  .addAction(async (ctx, ctxFn) => {
    const phone = getRealJid(ctx);
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp, `_El asistente chatbot va a responder a continuación_`);
    const currentUser = phone;
    if (!currentUser) return;
    ctxFn.state.update({ comefromfaq: true });
    const history = await sheetsService.getUserConv(currentUser);
    history.push({ role: "user", content: ctx.body });
    try {
      const AI = new aiServices(config.ApiKey);
      const response = await AI.chat(prompt, history);
      console.log("AI response:", response); // Log AI's response
      await sheetsService.addConverToUser(currentUser, [
        { role: "user", content: ctx.body },
        { role: "assistant", content: response },
      ]);

      await ctxFn.provider.sendText(phoneWithWhatsApp, response);
      await ctxFn.provider.sendText(phoneWithWhatsApp, 'Marca 0️⃣ para volver al menú principal');
    }
    catch (error) {
      console.error("Error during AI chat processing:", error);
      await ctxFn.provider.sendText(phoneWithWhatsApp, `Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.`);
    }
  })

  .addAction({ capture: true }, async (ctx, ctxFn) => {
    if (ctx.body && ctx.body.trim().toLowerCase() === "0") {
      return ctxFn.gotoFlow(initialButtonFlow);
    } else if (ctx.body && ctx.body.includes('_event_order')) {
      return ctxFn.gotoFlow(orderFlow);
    } else if (ctx.body && ctx.body.includes('_event_media')) {
      return ctxFn.gotoFlow(checkPaymentFlow);
    } else if (ctx.body && ctx.body.includes('_event_document')) {
      return ctxFn.gotoFlow(checkPaymentFlow);
    } else if (ctx.body && ctx.body.includes('_event_voice_note')) {
      return ctxFn.gotoFlow(voice_note_flow);
    } else {
      return ctxFn.gotoFlow(faqFlow);
    }
  }
  )





