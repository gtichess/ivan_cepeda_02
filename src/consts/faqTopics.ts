export type FaqTopic = {
	key: "A" | "B" | "C" | "D" | "E";
	label: string;
	fileName: string;
};

export const FAQ_TOPICS: FaqTopic[] = [
	{
		key: "A",
		label: "A. Drogas",
		fileName: "prompt_topic_1.txt",
	},
	{
		key: "B",
		label: "B. Campesinado",
		fileName: "prompt_topic_2.txt",
	},
	{
		key: "C",
		label: "C. Comunidad afros",
		fileName: "prompt_topic_3.txt",
	},
	{
		key: "D",
		label: "D. LGTBIQ+",
		fileName: "prompt_topic_4.txt",
	},
	{
		key: "E",
		label: "E. Salud",
		fileName: "prompt_topic_5.txt",
	},
];

export const FAQ_TOPIC_SELECTOR_MESSAGE = `Selecciona un tema para continuar:\n\n${FAQ_TOPICS.map(
	(topic) => `*${topic.label}*`
).join("\n")}\n\nResponde con la letra del tema que quieres consultar.`;

export const findFaqTopicBySelection = (rawValue: string): FaqTopic | undefined => {
	const normalizedValue = rawValue.trim().toLowerCase().replace(/\.$/, "");

	return FAQ_TOPICS.find((topic) => {
		const normalizedKey = topic.key.toLowerCase();
		const normalizedLabel = topic.label.trim().toLowerCase();

		return normalizedValue === normalizedKey || normalizedValue === normalizedLabel;
	});
};