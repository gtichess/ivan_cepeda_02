export const INITIAL_BUTTON_MENU = "Para continuar, escribe la palabra 'juego' 🎮.";

export const INITIAL_BUTTON_WELCOME_MESSAGE = `Al continuar, aceptas el uso adecuado y responsable de tus datos para avanzar en este proyecto de integración política 🤝.

${INITIAL_BUTTON_MENU}`;

const buildNamePrefix = (pushName?: string) => (pushName ? `${pushName}, ` : "");

export const getInitialButtonNewUserMessage = (pushName?: string) =>
	`${buildNamePrefix(pushName)}, bienvenido a Iván Cepeda _en primera vuelta_ 👋.`.trim();

export const getInitialButtonReturningMessage = (pushName?: string) =>
	`${buildNamePrefix(pushName)}, bienvenido de nuevo a Iván Cepeda _en primera vuelta_ 👋.

${INITIAL_BUTTON_MENU}`.trim();