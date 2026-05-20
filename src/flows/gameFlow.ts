import { addKeyword, EVENTS } from "@builderbot/bot";
import { SERVICE_QUESTION_STEPS } from "../consts/serviceQuestionnaire";
import { initialButtonFlow } from "./initialButtonFlow";
import { checkPaymentFlow } from "./checkPaymentFlow";
import { voice_note_flow } from "./voice_note_flow";
import { faqFlow } from "./faqFlow";

const normalizeAnswer = (value: string): "V" | "F" | null => {
  const normalized = value.trim().toLowerCase();
  if (["v", "verdadero"].includes(normalized)) {
    return "V";
  }
  if (["f", "falso"].includes(normalized)) {
    return "F";
  }
  return null;
};
const buildQuestionPrompt = (stepIndex: number): string => SERVICE_QUESTION_STEPS[stepIndex].prompt;
const validateStep = async (
  rawAnswer: string,
  stepIndex: number,
  ctxFn: any
): Promise<boolean> => {
  const answer = normalizeAnswer(rawAnswer);
  if (!answer) {
    ctxFn.fallBack("Respuesta no válida. Escribe únicamente *V* o *F*.");
    return false;
  }
  const step = SERVICE_QUESTION_STEPS[stepIndex];
  const currentScore = Number(ctxFn.state.get("quizScore") ?? 0);
  const isCorrect = answer === step.expected;
  await ctxFn.state.update({
    quizScore: isCorrect ? currentScore + 1 : currentScore,
  });
  const feedback = isCorrect ? "✅ Respuesta correcta." : `❌ Respuesta incorrecta. La respuesta correcta era *${step.expected}*.`;
  await ctxFn.flowDynamic(`${feedback}\n\n${step.followUp}`);
  return true;
};
const gameFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(`¡Arrancamos!

Vamos a jugar “Falso o Verdadero” 🔥
Te iremos enviando diferentes afirmaciones sobre la campaña y tú deberás responder si crees que son:

👉 F = Falso
👉 V = Verdadero

Después de cada pregunta, responde únicamente con la letra F o V 💬⚡`)
  .addAnswer(buildQuestionPrompt(0), { capture: true, delay: 1000 }, async (ctx, ctxFn) => {
    return validateStep(ctx.body, 0, ctxFn);
  })
  .addAnswer(buildQuestionPrompt(1), { capture: true }, async (ctx, ctxFn) => {
    return validateStep(ctx.body, 1, ctxFn);
  })
  .addAnswer(buildQuestionPrompt(2), { capture: true }, async (ctx, ctxFn) => {
    return validateStep(ctx.body, 2, ctxFn);
  })
  .addAnswer(buildQuestionPrompt(3), { capture: true }, async (ctx, ctxFn) => {
    return validateStep(ctx.body, 3, ctxFn);
  })
  .addAnswer(buildQuestionPrompt(4), { capture: true }, async (ctx, ctxFn) => {
    const isValidAnswer = await validateStep(ctx.body, 4, ctxFn);

    if (!isValidAnswer) {
      return;
    }

    const finalScore = Number(ctxFn.state.get("quizScore") ?? 0);
    await ctxFn.flowDynamic(`Has terminado el cuestionario.\n\nPuntaje final: *${finalScore} de ${SERVICE_QUESTION_STEPS.length}*.`);
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendImage(phoneWithWhatsApp, "./public/assets/1.jpeg", "¡Gracias por jugar! Aquí tienes un regalito 🎁");
    await ctxFn.flowDynamic(`Selecciona una opción:\n*0* - Volver al menú principal\n*1* - Ir a preguntas por tema sobre Iván\n*juego* - Reiniciar el cuestionario`);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    if (ctx.body && ctx.body.trim().toLowerCase() === "0") {
      return ctxFn.gotoFlow(initialButtonFlow);
    } else if (ctx.body && ctx.body.trim().toLowerCase() === '1') {
      return ctxFn.gotoFlow(faqFlow);
    } else if (ctx.body && ctx.body.trim().toLowerCase() === "juego") {
      return ctxFn.gotoFlow(gameFlow);
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

export { gameFlow };