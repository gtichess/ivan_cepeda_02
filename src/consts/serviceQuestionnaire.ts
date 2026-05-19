export type QuestionStep = {
	prompt: string;
	expected: "V" | "F";
	followUp: string;
};

export const SERVICE_QUESTION_STEPS: QuestionStep[] = [
	{
		prompt:
			"*Pregunta 1 de 5*\n\nSegún el texto, el gobierno actual ha expropiado motos de domiciliarios y el dólar llegó a 10 mil pesos.\n\nResponde con *V* o *F*.",
		expected: "F",
		followUp:
			"❤️ ¿Recuerdas las amenazas de que iban a expropiar hasta la moto de los domiciliarios? Pues no. Eso no ha pasado, y tampoco se ha expropiado a los grandes terratenientes.\n\n❤️ ¿Recuerdas las amenazas de que el dólar iba a llegar a 10 mil pesos? Pues no. Petro ha sido, en realidad, un gran demócrata... hasta el punto de sentarse a hablar con Trump.",
	},
	{
		prompt:
			"*Pregunta 2 de 5*\n\nEl texto afirma que Colombia se ha vuelto como Venezuela (sin comida ni movimiento económico), pero también dice que los centros comerciales y conciertos están llenos.\n\nResponde con *V* o *F*.",
		expected: "F",
		followUp:
			"❤️ ¿Recuerdas las amenazas de que esto se iba a volver como Venezuela, donde no hay comida ni movimiento económico? Pues no. Los centros comerciales y los conciertos de Shakira y Bad Bunny se están a reventar. Hay artistas que ya llevan cinco fechas llenas en el Movistar Arena.",
	},
	{
		prompt:
			"*Pregunta 3 de 5*\n\nEl texto advierte que si vuelve la derecha, podrían bajar el salario mínimo, y que nadie de la derecha defendió la reforma laboral.\n\nResponde con *V* o *F*.",
		expected: "V",
		followUp:
			"❤️ Ahora bien, si la derecha vuelve, hasta podrían bajarle al salario mínimo. ¿O acaso vimos a alguien de la derecha defendiéndolo cuando tocó defender la reforma laboral?",
	},
	{
		prompt:
			"*Pregunta 4 de 5*\n\nEl texto indica que el subsidio para adultos mayores pasó de 80.000 a 230.000, y que más de 3 millones de personas mayores lo perderían si regresa la derecha.\n\nResponde con *V* o *F*.",
		expected: "V",
		followUp:
			"❤️ ¿Tiene usted un familiar viejito de los que recibían 80 mil pesos de subsidio? Pues sí, y de verdad que ahora mi papá recibe los 230 mil. Si regresan quienes han gobernado para unos pocos, más de 3 millones de personas mayores se quedarían sin el subsidio de 230.000.",
	},
	{
		prompt:
			"*Pregunta 5 de 5*\n\nEl texto sostiene que este gobierno ha sido el único que realmente bajó el sueldo a los políticos.\n\nResponde con *V* o *F*.",
		expected: "V",
		followUp:
			"❤️ Y hay algo que de verdad no tiene precedentes: este ha sido el único Gobierno que realmente les bajó el sueldo a los políticos. A quienes no creen en la política, recuérdales eso.",
	},
];