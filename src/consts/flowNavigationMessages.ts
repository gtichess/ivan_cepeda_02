export const GAME_FLOW_INTRO_MESSAGE = [
  "¡Arrancamos!",
  "",
  "Vamos a jugar “Falso o Verdadero” 🔥",
  "Te iremos enviando diferentes afirmaciones sobre la campaña y tú deberás responder si crees que son:",
  "",
  "👉 F = Falso",
  "👉 V = Verdadero",
  "",
  "Después de cada pregunta, responde únicamente con la letra F o V 💬⚡",
].join("\n");

export const buildGameFlowFinalScoreMessage = (finalScore: number, totalSteps: number): string =>
  `¡Terminaste el cuestionario! 🎉\n\nTu puntaje final fue: *${finalScore} de ${totalSteps}*.`;

export const SHARED_NEXT_STEP_NAVIGATION_MESSAGE = [
  "📋 *Elige tu próximo paso:*",
  "",
  "*0* - Volver al menú principal",
  "*1* - Ir a preguntas por tema sobre Iván",
  "*juego* - Reiniciar el cuestionario",
].join("\n");

export const GAME_FLOW_GIFT_IMAGE_CAPTION = "¡Gracias por jugar! Aquí tienes un regalito 🎁";