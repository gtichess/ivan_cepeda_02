import { addKeyword, EVENTS } from "@builderbot/bot";
// import { DetectIntention } from "./intention.flow";
import { faqFlow } from "./faqFlow";
// import { sendEmailLink } from "./list_templates/sendEmailLink";
import { initialButtonFlow } from "./initialButtonFlow";
import { guideToShopFlow } from "./guideToShopFlow";
import { orderFlow } from "./orderFlow";
import { checkPaymentFlow } from "./checkPaymentFlow";
import { commonActionFlow } from "./commonActionFlow";
import { getRealJid } from "~/utils/whatsapp-utils";


const cateringFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp, "🍽️🏠LA CASA CATERING 🏢  🍽️\n" +
      "Te ayudamos, ya sea en tu casa o en tu empresa, a diseñar y realizar tus eventos. \n" +
      "Estoy aquí para ayudarte a organizar y cotizar desayunos, refrigerios, almuerzos, cenas, cócteles, refrigerios y más.\n"
    )
  })
  .addAction(async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp, `**Por favor, envíanos en un SOLO MENSAJE la siguiente información sobre tu evento:**\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━ \n_puedes copiar el siguiente bloque para editar mejor_👇\n`
    )
  })
  .addAction(async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp,
      "** Datos del Evento:**\n" +
      "• Nombre :\n" +
      "• Correo electrónico :\n" +
      "• Fecha del Evento :\n" +
      "• Número de Personas :\n" +
      "• Lugar del Evento (dentro o fuera de Bogotá):\n" +
      "• Tiempo de Alimentación  (Desayuno, Refrigerio, Almuerzo, Cena, Coctel, etc):\n" +
      "• Tipo de comida o Menú deseado (Asado, Mexicana, Paella, Colombiana, Pasabocas, etc):\n" +
      "━━━━━━━━━━━━━━━━━━━━━━\n" +
      "✅ **Por favor incluye cualquier otra información relevante para tu cotización*"
    )
  }
  )
  .addAction(async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp,
      "O si lo prefieres, completa la información en este formulario:\nhttps://lacasacocina.com/catering/eventos-catering\n\n" +
      "⚠ **ATENCIÓN:** Esta información es indispensable para elaborar tu cotización.\nEntre más detalles tengamos, más clara y ajustada será tu cotización.\n_EN UN SOLO MENSAJE_ 👇🏼"
    )
   })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp, "Si tenemos alguna duda, nos comunicaremos contigo lo más pronto posible.");
    
  })
  .addAction({ capture: false }, async (ctx, ctxFn) => {
    const phone = ctxFn.state.get("phone");
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp, "En el transcurso de las próximas 48 horas (o menos) recibirás en tu correo la cotización solicitada 😉.\n\nMarca 0️⃣ para volver al menú inicial");
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    return ctxFn.gotoFlow(initialButtonFlow)
  })

export { cateringFlow };
