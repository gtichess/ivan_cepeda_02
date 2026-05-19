import { addKeyword } from "@builderbot/bot";
import { SERVICE_QUESTION_STEPS } from "../consts/serviceQuestionnaire";

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
const mainFlow = addKeyword("service")
  .addAction(async (_, ctxFn) => {
    await ctxFn.state.update({ quizScore: 0 });
    await ctxFn.flowDynamic("Estás a punto de iniciar el cuestionario. Responde cada afirmación con *V* o *F*.");
  })
  .addAnswer(buildQuestionPrompt(0), { capture: true }, async (ctx, ctxFn) => {
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
  });

export { mainFlow };
