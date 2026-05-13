import { addAnswer, addKeyword, EVENTS } from "@builderbot/bot";
import { getDeliveryDate } from "../utils/deliveryDate";
import sheetsServiceOrder from "../services/sheetsServiceOrder";
import { registerFlow } from "./registerFlow";
import sheetsService from "../services/sheetsService";
// import { initialButtonFlow } from "./initialButtonFlow";
import { cateringFlow } from "./cateringFlow";
import { faqFlow } from "./faqFlow";
import { orderFlow } from "./orderFlow";
import { checkPaymentFlow } from "./checkPaymentFlow";
import { guideToShopFlow } from "./guideToShopFlow";
import { voice_note_flow } from "./voice_note_flow";
// import { getRealJid } from "~/utils/whatsapp-utils";
import { getRealJid } from "~/utils/whatsapp-utils";
import { initialButtonFlow } from "./initialButtonFlow";

// const llave = 10;

const orderFinalFlow = addKeyword(EVENTS.ACTION)
  // .addAnswer('...')
  .addAction({ capture: false, delay: 1000 }, async (ctx, ctxFn) => {
    const phone = getRealJid(ctx)
    ctxFn.state.update({ phone: phone });
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp, `🥡 *¿Cómo deseas que empaquemos tus porciones?*\n\n` +
      `Por favor elige una opción respondiendo solo el número (obligatorio):\n` +
      `1️⃣ Individual\n` +
      `2️⃣ Pareja\n` +
      `3️⃣ Familiar`
    )
    //   ctxFn.flowDynamic(`🥡 *¿Cómo deseas que empaquemos tus porciones?*\n\n` +
    //     `Por favor elige una opción respondiendo solo el número (obligatorio):\n` +
    //     `1️⃣ Individual\n` +
    //     `2️⃣ Pareja\n` +
    //     `3️⃣ Familiar`)
    // })
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    // Store the answer to the 19-line question
    ctxFn.state.update({ empaquetadoReospuesta: ctx.body });
  })

  .addAction({ capture: false }, async (ctx, ctxFn) => {
    let empaquetagem = null;
    const answer = ctxFn.state.get("empaquetadoReospuesta")?.trim();
    console.log('User packaging answer:', answer);
    // Determine empaquetagem based on user input
    if (answer === '1') empaquetagem = 'Individual';
    else if (answer === '2') empaquetagem = 'Pareja';
    else if (answer === '3') empaquetagem = 'Familiar';
    if (!empaquetagem) {
      const phone = ctxFn.state.get("phone");
      const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
      await ctxFn.provider.sendText(phoneWithWhatsApp, `Por favor, responde con 1 (Individual), 2 (Pareja) o 3 (Familiar).`)
      return ctxFn.gotoFlow(orderFinalFlow, 1);
    }
    ctxFn.state.update({ empaquetagem });
  })
  .addAction({ delay: 2000 }, async (ctx, ctxFn) => {
    const phone = getRealJid(ctx)
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp, `📝 **Finalmente, puedes agregar algún comentario sobre el pedido:**\n\n` +
      `Por ejemplo: *cambio de horario de entrega, cambio de ingredientes* o algún cambio en la dirección registrada.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👉 **Campo obligatorio:**\n` +
      `Si no tienes ninguna observación por favor escribe **NO** ya que este es un campo de respuesta OBLIGATORIA.\n`
    )
  })
  // await ctxFn.flowDynamic([{
  //   body: `📝 **Finalmente, puedes agregar algún comentario sobre el pedido:**\n\n` +
  //     `Por ejemplo: *cambio de horario de entrega, cambio de ingredientes* o algún cambio en la dirección registrada.\n\n` +
  //     `━━━━━━━━━━━━━━━━━━━━━━\n` +
  //     `👉 **Campo obligatorio:**\n` +
  //     `Si no tienes ninguna observación por favor escribe **NO** ya que este es un campo de respuesta OBLIGATORIA.\n`
  // }]);

  .addAction({ capture: true }, async (ctx, ctxFn) => {
    ctxFn.state.update({ observation: ctx.body });
    console.log('User observation:--->', ctx.body);
    // Console log current hour and minutes
    const now = new Date();
    console.log(`Current time: ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    // Use getDeliveryDate from utils

    const formattedDeliveryDate = getDeliveryDate(new Date(new Date().getTime() - 5 * 60 * 60 * 1000));

    // console.log("Formatted delivery date for order:", formattedDeliveryDate);
    // Prepare all order data here
    // Use getDeliveryDate from previous scope (already defined above)
    // await ctxFn.state.update({ param3: ctx.body });
    const user = getRealJid(ctx);
    if (!user) {
      console.error("Could not resolve WhatsApp user");
      return;
    }
    const order = ctxFn.state.get("order");
    const phoneWithWhatsApp = `${user}@s.whatsapp.net`;
    const trimmedOrder = order ? String(order).slice(0, 5) : "";
    const totalOrder = Number(ctxFn.state.get("totalOrder")) / 1000;
    const formattedTotalOrder = `$${totalOrder.toLocaleString("es-ES", { maximumFractionDigits: 0 })}`;
    // const user = ctxFn.state.get("phone");
    const productId = "---";
    const productName = "---";
    const productQuantity = "---";
    const productPrice = 0;
    const observation = ctxFn.state.get("observation") || "No observations";
    const orderDate = new Date(new Date().getTime() - 5 * 60 * 60 * 1000).toISOString();
    const totalItems = ctxFn.state.get("orderLength");
    const userInfo = await sheetsServiceOrder.getUserInfo(user);
    const str = userInfo.address_delivery_charge;
    console.log('address_delivery_charge from googlSheets (raw)', str)
    function safeParseNumber(str: string | number | null | undefined): number | null {
      if (typeof str === 'number') return Number.isNaN(str) ? null : str;
      if (typeof str !== 'string') return null;
      const cleaned = str.replace(/,/g, '');
      const num = Number(cleaned);
      return Number.isNaN(num) ? null : num;
    }
    const delivery_charge = safeParseNumber(str); // 20000

    console.log('address_delivery_charge from googlSheets', delivery_charge)

    const granTotalAPagar = totalOrder + (delivery_charge ?? 0);
    console.log('grantotal a pagar', granTotalAPagar)
    // const granTotalAPagarF = `$${granTotalAPagar.toLocaleString("es-ES", { maximumFractionDigits: 0 })}`;
    const empaquetagem = ctxFn.state.get("empaquetagem") || '---';

    // console.log('gran total a pagar F', granTotalAPagarF)
    // let formattedDeliveryCharge;
    // console.log('Storing order with data:', { trimmedOrder, user, productId, productName, productQuantity, productPrice, totalOrder, observation, orderDate, totalItems, formattedDeliveryDate, granTotalAPagar, empaquetagem });

    await sheetsServiceOrder.createOrder(trimmedOrder, user, productId, productName, productQuantity, productPrice, totalOrder, observation, orderDate, totalItems, formattedDeliveryDate, granTotalAPagar, empaquetagem);

    console.log('delivery charge after googlesheets loading', delivery_charge)

    const formattedDeliveryCharge = `$${(delivery_charge ?? 0).toLocaleString("es-ES", { maximumFractionDigits: 0 })}`;
    console.log(formattedDeliveryCharge)
    function formatCOPNoCents(value: number | string): string {
      return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    }

    console.log(formatCOPNoCents(granTotalAPagar)); // Output: $136.800

    const formattedGTAP = formatCOPNoCents(granTotalAPagar)

    let messageBody = `¡Excelente!\nTu pedido 📝 fue cargado satisfactoriamente.\n` +
      `- 🗓️ *Fecha de entrega:* ${formattedDeliveryDate}\n` +
      `- 📦 *Pedido número:* ${trimmedOrder}\n` +
      `- 🏷️ *Tipo de empaquetado:* ${empaquetagem}\n` +
      `- 📍 *Lugar de entrega:* ${userInfo.address}\n` +
      `- 💰 *Subtotal de pedido (comida):* ${formattedTotalOrder}\n` +
      `- 🚚 *Valor domicilio:* ${formattedDeliveryCharge}\n` +
      `- 💵 *GRAN TOTAL A PAGAR (comida + domicilio):* ${formattedGTAP}\n\n`;

    if (delivery_charge === null || Number.isNaN(delivery_charge) || delivery_charge === undefined) {
      messageBody += `NOTA: si este es tu primer pedido, próximamente te contactaremos para indicarte el 💲GRAN  TOTAL A PAGAR (comida+domicilio)`;
    }

    await ctxFn.provider.sendText(phoneWithWhatsApp, messageBody)


    // await ctxFn.flowDynamic([{
    //   body:
    //     `¡Excelente!\nTu pedido 📝 fue cargado satisfactoriamente.\n` +
    //     `- 🗓️ *Fecha de entrega:* ${formattedDeliveryDate}\n` +
    //     `- 📦 *Pedido número:* ${trimmedOrder}\n` +
    //     `- 🏷️ *Tipo de empaquetado:* ${empaquetagem}\n` +
    //     `- 📍 *Lugar de entrega:* ${userInfo.address}\n` +
    //     `- 💰 *Subtotal de pedido (comida):* ${formattedTotalOrder}\n` +
    //     `- 🚚 *Valor domicilio:* ${formattedDeliveryCharge}\n` +
    //     `- 💵 *GRAN TOTAL A PAGAR (comida + domicilio):* ${formattedGTAP}\n\n` +
    //     `NOTA: si este es tu primer pedido, próximamente te contactaremos para indicarte el 💲GRAN  TOTAL A PAGAR (comida+domicilio)`
    //   ,
    //   delay: 2000
    // }])




  })
  .addAction({ delay: 4000 }, async (ctx, ctxFn) => {
    const phone = getRealJid(ctx)
    const phoneWithWhatsApp = `${phone}@s.whatsapp.net`;
    await ctxFn.provider.sendText(phoneWithWhatsApp,
      `- *Opción 1*: Cuenta Davivienda AHORROS #008600858768 a nombre de LA CASA PAAM SAS (NIT 901.824.571-9); Llave bre-B: @DAVICASAPAAM\n` +
      `- *Opción 2*: NEQUI 3108013873 a nombre de Ana Maria Umaña (cc52411128)\n` +
      `- *Opción 3*: NEQUI 3005508530 a nombre de Pablo Andres Restrepo (cc80093643)\n\n\n\n` +
      ` ⚠️ Por favor envía el *comprobante de pago* *_EN UNA FOTO_* 📃📷 a este chat para preparar y despachar tu pedido.\n\n` +
      `Marca 0️⃣ para volver al menú principal`
    )
  })

  // .addAction({ delay: 4000 }, async (ctx, ctxFn) => {
  //   await ctxFn.flowDynamic(
  //     `- *Opción 1*: Cuenta Davivienda AHORROS #008600858768 a nombre de LA CASA PAAM SAS (NIT 901.824.571-9); LLAVE: @DAVICASAPAAM\n` +
  //     `- *Opción 2*: NEQUI 3108013873 a nombre de Ana Maria Umaña (cc52411128)\n` +
  //     `- *Opción 3*: NEQUI 3005508530 a nombre de Pablo Andres Restrepo (cc80093643)\n\n\n\n` +
  //     ` ⚠️ Por favor envía el *comprobante de pago* *_EN UNA FOTO_* 📃📷 a este chat para preparar y despachar tu pedido.\n\n`
  //   )
  // })


  .addAction({ capture: true }, async (ctx, ctxFn) => {
    console.log('User selected option in orderFinalFlow:', ctx.body);
    if (ctx.body === '0') {
      return ctxFn.gotoFlow(initialButtonFlow);
    } else if (ctx.body && ctx.body.includes('_event_order')) {
      return ctxFn.gotoFlow(orderFlow);
    } else if (ctx.body && ctx.body.includes('_event_media')) {
      return ctxFn.gotoFlow(checkPaymentFlow);
    } else if (ctx.body && ctx.body.includes('_event_document')) {
      return ctxFn.gotoFlow(checkPaymentFlow);
    } else if (ctx.body && ctx.body.includes('_event_voice_note')) {
      return ctxFn.gotoFlow(voice_note_flow);
    }

    // return ctxFn.gotoFlow(faqFlow);
    return ctxFn.gotoFlow(initialButtonFlow);

  }

  )

  ;

export { orderFinalFlow };



