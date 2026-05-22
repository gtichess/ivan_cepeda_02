import { addKeyword, EVENTS } from "@builderbot/bot";
import { SERVICE_QUESTION_STEPS } from "../consts/serviceQuestionnaire";
import { initialButtonFlow } from "./initialButtonFlow";
import { checkPaymentFlow } from "./checkPaymentFlow";
import { voice_note_flow } from "./voice_note_flow";
import { faqFlow } from "./faqFlow";
import {
  buildGameFlowFinalScoreMessage,
  GAME_FLOW_GIFT_IMAGE_CAPTION,
  GAME_FLOW_INTRO_MESSAGE,
  SHARED_NEXT_STEP_NAVIGATION_MESSAGE,
} from "../consts/flowNavigationMessages";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

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

  const outputMessage = `${feedback}\n\n${step.followUp}`;
  const phone = ctxFn.state.get("phone");
  const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
  // await sleep(5000);
  await ctxFn.provider.sendText(phoneWithWhatsApp, outputMessage);

  // await ctxFn.flowDynamic(`${feedback}\n\n${step.followUp}`);
  return true;
};
const gameFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(GAME_FLOW_INTRO_MESSAGE)
  // .addAction({ capture: false }, async (ctx, ctxFn) => {
  //   const phone = ctxFn.state.get("phone");
  //   const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
  //   await sleep(5000);
  //   await ctxFn.provider.sendText(phoneWithWhatsApp, '¡Empecemos con la primera pregunta! 🔥');
  // })
  .addAnswer(buildQuestionPrompt(0), { capture: true }, async (ctx, ctxFn) => {
    return validateStep(ctx.body, 0, ctxFn);
  })
  .addAction({ capture: false }, async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await sleep(5000);
    await ctxFn.provider.sendText(phoneWithWhatsApp, '¡Vamos con la siguiente pregunta! 🔥');
    await sleep(5000);
  })
  .addAnswer(buildQuestionPrompt(1), { capture: true }, async (ctx, ctxFn) => {
    return validateStep(ctx.body, 1, ctxFn);
  })
  .addAction({ capture: false }, async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await sleep(5000);
    await ctxFn.provider.sendText(phoneWithWhatsApp, '¡Vamos con la siguiente pregunta! 🔥');
    await sleep(5000);
  })
  .addAnswer(buildQuestionPrompt(2), { capture: true }, async (ctx, ctxFn) => {
    return validateStep(ctx.body, 2, ctxFn);
  })
  .addAction({ capture: false }, async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await sleep(5000);
    await ctxFn.provider.sendText(phoneWithWhatsApp, '¡Vamos con la siguiente pregunta! 🔥');
    await sleep(5000);
  })
  .addAnswer(buildQuestionPrompt(3), { capture: true }, async (ctx, ctxFn) => {
    return validateStep(ctx.body, 3, ctxFn);
  })
  .addAction({ capture: false }, async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await sleep(5000);
    await ctxFn.provider.sendText(phoneWithWhatsApp, '¡Vamos con la siguiente pregunta! 🔥');
    await sleep(5000);
  })
  .addAnswer(buildQuestionPrompt(4), { capture: true }, async (ctx, ctxFn) => {
    const isValidAnswer = await validateStep(ctx.body, 4, ctxFn);

    if (!isValidAnswer) {
      return;
    }
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    const finalScore = Number(ctxFn.state.get("quizScore") ?? 0);
    await sleep(3000);
    const finalScoreMessage = buildGameFlowFinalScoreMessage(finalScore, SERVICE_QUESTION_STEPS.length);
    await sleep(3000);
    await ctxFn.provider.sendText(phoneWithWhatsApp, finalScoreMessage);
    // await sleep(3000);
    // await ctxFn.provider.sendText(phoneWithWhatsApp, "¡Gracias por participar en el juego! 🎉");
    await sleep(5000);
    await ctxFn.provider.sendImage(phoneWithWhatsApp, "./public/assets/1.jpeg", GAME_FLOW_GIFT_IMAGE_CAPTION);
    await sleep(5000);
    await ctxFn.provider.sendText(phoneWithWhatsApp, SHARED_NEXT_STEP_NAVIGATION_MESSAGE)
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