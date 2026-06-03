import { addKeyword, EVENTS } from "@builderbot/bot";
import { initialButtonFlow } from "./initialButtonFlow";
import { getRealJid } from "~/utils/whatsapp-utils";

const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

const kitFlow = addKeyword([EVENTS.ACTION])
    .addAction({ capture: false }, async (ctx, ctxFn) => {
        const phone = getRealJid(ctx);
        const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
        await ctxFn.provider.sendText(
            phoneWithWhatsApp,
            '📦 *Kit de campaña*\n\nEn breve recibirás el material de campaña de Iván Cepeda. ¡Gracias por tu apoyo! 🙌'
        );
        await sleep(2000);
        await ctxFn.provider.sendText(
            phoneWithWhatsApp,
            '... cargando kit de campaña...🚀'
        );
        await sleep(3000);
        await ctxFn.provider.sendMedia(phoneWithWhatsApp, './public/assets/MarioM.png', 'https://x.com/MarcelaValak/status/2061821101659869295?s=20\n"_hacer la guerra con sangre ajena es muy fácil_"');
        await sleep(3000);
        await ctxFn.provider.sendMedia(
            phoneWithWhatsApp, './public/assets/ee.png',
            `https://x.com/elespectador/status/2061908696804851873?s=20\n\n¿Acaso tienes esposa o mamá o hermanas?`
        );
        await sleep(3000);
        await ctxFn.provider.sendMedia(phoneWithWhatsApp, "./public/assets/campanha_sucia.png", 'https://youtu.be/pktmb9_oJEE?si=MvSj6CCtHqU71aSL\n\n¿Acaso tienes esposa o mamá o hermanas?');
        await sleep(3000);
        await ctxFn.provider.sendMedia(phoneWithWhatsApp, "./public/assets/undoctorenmedicina.png", 'https://x.com/FisicoImpuro/status/2061922647542231100?s=20\n\nDoctor en medicina en ejercicio.');
        await sleep(3000);
        await ctxFn.provider.sendMedia(phoneWithWhatsApp, './public/assets/daniRojas.png', 'En menos de 5 minutos se puede ver esto\nhttps://x.com/DanielRMed/status/2061827721982878202?s=20');
        await sleep(6000);
        await ctxFn.provider.sendText(phoneWithWhatsApp, "Puedes escribr lo que quieras para volver al menú principal.");
    })
    .addAction({ capture: true }, async (ctx, { gotoFlow }) => {
        return gotoFlow(initialButtonFlow);
    });

export { kitFlow };
