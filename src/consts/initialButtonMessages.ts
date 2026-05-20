export const INITIAL_BUTTON_MENU = "Para continuar, escribe la palabra 'juego' 🎮.";

export const INITIAL_BUTTON_WELCOME_MESSAGE = `Al continuar, aceptas el uso adecuado y responsable de tus datos para avanzar en este proyecto de integración política 🤝.

${INITIAL_BUTTON_MENU}`;

const buildNamePrefix = (pushName?: string) => (pushName ? `${pushName}, ` : "");

export const getInitialButtonNewUserMessage = (pushName?: string) =>
	`${buildNamePrefix(pushName)}🔥 ¿Te le mides al juego? 🎮

Este espacio es para desmentir mitos, aclarar dudas y hablar sin filtros sobre lo que se dice de la campaña de Iván Cepeda 💬⚡`.trim();

export const getInitialButtonReturningMessage = (pushName?: string) =>
	`${buildNamePrefix(pushName)}🔥 ¿Te le mides al juego? 🎯

Este espacio es para desmentir mitos, aclarar dudas y hablar sin filtros sobre lo que se dice de la campaña de Iván Cepeda 💬⚡

${INITIAL_BUTTON_MENU}`.trim();