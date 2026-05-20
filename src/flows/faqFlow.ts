import { addKeyword, EVENTS } from "@builderbot/bot";
import aiServices from "~/services/aiServices";
import { config } from "../config";
import path from "path";
import fs from "fs";
import { initialButtonFlow } from "./initialButtonFlow";
import { getRealJid } from "~/utils/whatsapp-utils";
import { orderFlow } from "./orderFlow";
import { gameFlow } from "./gameFlow";
import { voice_note_flow } from "./voice_note_flow";
import { checkPaymentFlow } from "./checkPaymentFlow";
import {
	FAQ_TOPIC_SELECTOR_MESSAGE,
	findFaqTopicBySelection,
} from "../consts/faqTopics";
import {
  FAQ_CLOSING_INVITATION_MESSAGE,
  FAQ_NAVIGATION_MESSAGE,
} from "../consts/faqNavigationMessages";

const promptDirectoryPath = path.join(
  process.cwd(),
  "public/assets/prompts"
);
const pathPrompt = path.join(promptDirectoryPath, "prompt_OpenAi.txt");
const prompt = fs.readFileSync(pathPrompt, "utf8");

const sendFaqNavigationWithClosingInvitation = async (
  ctxFn: any,
  phoneWithWhatsApp: string
) => {
  await ctxFn.provider.sendText(phoneWithWhatsApp, FAQ_CLOSING_INVITATION_MESSAGE);
  await ctxFn.provider.sendText(phoneWithWhatsApp, FAQ_NAVIGATION_MESSAGE);
};

const buildTopicPrompt = (fileName: string): string => {
	const topicPromptPath = path.join(promptDirectoryPath, fileName);
	const topicPrompt = fs.readFileSync(topicPromptPath, "utf8");

	return `${prompt}\n\nDocumento base:\n${topicPrompt}`;
};


export const faqFlow = addKeyword([EVENTS.ACTION])
  .addAction(async (ctx, ctxFn) => {
    const phone = getRealJid(ctx);
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp, `Puedes hacerme cualquier pregunta sobre Iván Cepeda, su campaña, propuestas, historia, o cualquier tema relacionado. Estoy aquí para ayudarte a conocer más sobre él y su visión para Colombia.`);
    await ctxFn.provider.sendText(phoneWithWhatsApp, FAQ_TOPIC_SELECTOR_MESSAGE);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const selectedTopic = findFaqTopicBySelection(ctx.body ?? "");

    if (!selectedTopic) {
      return ctxFn.fallBack(`Tema no válido. Elige una de las opciones disponibles.\n\n${FAQ_TOPIC_SELECTOR_MESSAGE}`);
    }

    const phone = getRealJid(ctx);
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.state.update({
      comefromfaq: true,
      faqTopicFileName: selectedTopic.fileName,
      faqTopicLabel: selectedTopic.label,
    });

    await ctxFn.provider.sendText(
      phoneWithWhatsApp,
      `Elegiste *${selectedTopic.label}*.\n\nEscribe ahora tu pregunta sobre este tema.`
    );
  })

  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const phone = getRealJid(ctx);
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    const topicFileName = ctxFn.state.get("faqTopicFileName");

    if (!topicFileName) {
      await ctxFn.provider.sendText(phoneWithWhatsApp, "No pude identificar el tema seleccionado. Vamos a intentarlo de nuevo.");
      return ctxFn.gotoFlow(faqFlow);
    }

    await ctxFn.provider.sendText(phoneWithWhatsApp, `_El asistente chatbot va a responder a continuación_`);

    try {
      const topicPrompt = buildTopicPrompt(topicFileName);
      const AI = new aiServices(config.ApiKey);
      const response = await AI.chat(topicPrompt, [{ role: "user", content: ctx.body }]);
      console.log("AI response:", response);

      if (response === "ERROR") {
        await ctxFn.provider.sendText(phoneWithWhatsApp, `Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.`);
        await sendFaqNavigationWithClosingInvitation(ctxFn, phoneWithWhatsApp);
        return;
      }

      await ctxFn.provider.sendText(phoneWithWhatsApp, response);
      await sendFaqNavigationWithClosingInvitation(ctxFn, phoneWithWhatsApp);
    }
    catch (error) {
      console.error("Error during AI chat processing:", error);
      await ctxFn.provider.sendText(phoneWithWhatsApp, `Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.`);
      await sendFaqNavigationWithClosingInvitation(ctxFn, phoneWithWhatsApp);
    }
  })

  .addAction({ capture: true }, async (ctx, ctxFn) => {
    if (ctx.body && ctx.body.trim().toLowerCase() === "0") {
      return ctxFn.gotoFlow(initialButtonFlow);
    } else if (ctx.body && ctx.body.trim().toLowerCase() === "1") {
      return ctxFn.gotoFlow(faqFlow);
    } else if (ctx.body && ctx.body.trim().toLowerCase() === "juego") {
      return ctxFn.gotoFlow(gameFlow);
    } else if (ctx.body && ctx.body.includes('_event_order')) {
      return ctxFn.gotoFlow(orderFlow);
    } else if (ctx.body && ctx.body.includes('_event_media')) {
      return ctxFn.gotoFlow(checkPaymentFlow);
    } else if (ctx.body && ctx.body.includes('_event_document')) {
      return ctxFn.gotoFlow(checkPaymentFlow);
    } else if (ctx.body && ctx.body.includes('_event_voice_note')) {
      return ctxFn.gotoFlow(voice_note_flow);
    } else {
      return ctxFn.gotoFlow(initialButtonFlow);
    }
  }
  )





