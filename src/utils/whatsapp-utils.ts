/**
 * Devuelve siempre el número real de WhatsApp (formato @s.whatsapp.net),
 * incluso si el mensaje proviene de un dispositivo vinculado (LID).
 *
 * @param {Object} ctx - El contexto del mensaje (Builderbot/Baileys)
 * @returns {string|null} - JID real del contacto o null si no se puede resolver
 */
export const getRealJid = (ctx: any): string | null => {
  try {
    let result = null;
    // console.log('remoteJid',ctx.key.remoteJid || 'N/A')
    // console.log('remoteJidAlt',ctx.key.remoteJidAlt || 'N/A')
    // console.log('from',ctx.from || 'N/A')
    // console.log('participant', ctx.key.participant || 'N/A')

    //1.  Caso más directo: si senderPn existe (nuevo parámetro de Baileys)
    if (ctx?.senderPn) {
      result = String(ctx.senderPn).replace(/[^\d]/g, '');
      console.log('Case 1')
    }

    //2. Si el remoteJid principal ya es real
    else if (ctx?.key?.remoteJid?.endsWith('@s.whatsapp.net')) {
      result = ctx.key.remoteJid.replace('@s.whatsapp.net', '').replace(/[^\d]/g, '');
      console.log('Case 2')
    }

    //2.4 Si el senderPn
    else if (ctx?.key?.senderPn?.endsWith('@s.whatsapp.net')) {
      result = ctx.key.senderPn.replace('@s.whatsapp.net', '').replace(/[^\d]/g, '');
      console.log('Case 2.4')
    }

    //2.5. Si el remoteJid principal ya es real
    else if (ctx?.respMessage?.key?.remoteJid?.endsWith('@s.whatsapp.net')) {
      const jid = ctx.respMessage.key.remoteJid;
      result = jid.split('@')[0].split(':')[0];
      console.log('Case 2.5 - Fixed');
    }

    //3. Si viene de un dispositivo vinculado pero incluye remoteJidAlt
    else if (ctx?.key?.remoteJid?.endsWith('@lid') && ctx?.key?.remoteJidAlt?.endsWith('@s.whatsapp.net')) {
      result = ctx.key.remoteJidAlt.replace('@s.whatsapp.net', '').replace(/[^\d]/g, '');
      console.log('Case 3')
    }

    //4.  Si el 'from' ya es real
    else if (ctx?.from?.endsWith('@s.whatsapp.net')) {
      result = ctx.from.replace('@s.whatsapp.net', '').replace(/[^\d]/g, '');
      console.log('Case 4')
    }

    //5. Si viene de un grupo y tiene participant real
    else if (ctx?.key?.participant?.endsWith('@s.whatsapp.net')) {
      result = ctx.key.participant.replace('@s.whatsapp.net', '').replace(/[^\d]/g, '');
      console.log('Case 5')
    }

    //6.  Si remoteJidAlt está presente y es real
    else if (ctx?.key?.remoteJidAlt?.endsWith('@s.whatsapp.net')) {
      result = ctx.key.remoteJidAlt.replace('@s.whatsapp.net', '').replace(/[^\d]/g, '');
      console.log('Case 6')
    }

    // 7️⃣ Fallback: buscar cualquier número de 10 a 15 dígitos
    else {
      const candidate =
        ctx?.key?.remoteJid ||
        ctx?.from ||
        ctx?.key?.participant ||
        ctx?.key?.remoteJidAlt;

      const match = String(candidate || '').match(/\d{10,15}/);
      if (match) result = match[0];
      console.log('Case 7')
    }

    console.log(`🔍 [getRealJid] Resultado final → ${result || 'null'}`);
    // console.log(ctx)
    return result;
  } catch (err) {
    console.error('Error resolviendo getRealJid:', err);
    return null;
  }
};
