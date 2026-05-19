export const INITIAL_BUTTON_MENU = "Escribe la palabra 'juego' para continuar";

export const INITIAL_BUTTON_WELCOME_MESSAGE = `Al continuar con la navegación estás aceptando que usemos adecuadamente y responsablemente tus datos para seguir adelante con este proyecto de integración política.

${INITIAL_BUTTON_MENU}`;

export const getInitialButtonReturningMessage = (pushName?: string) =>
	`${pushName ?? ""} bienvenido de nuevo a Iván Cepeda _en primera vuelta_.

${INITIAL_BUTTON_MENU}`.trim();