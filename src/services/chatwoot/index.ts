import { config } from "../../config";

/**
 * Es la función que importa para guardar los mensajes y crear lo que sea necesario
 * @param dataIn pasando los datos del contacto + el mensaje
 * @param chatwoot la dependencia del chatwoot...(create, buscar...)
 */
const handlerMessage = async (
  dataIn: {
    phone: string | null; // Updated to use the result from getRealJid
    name: any;
    message: any;
    mode: any;
    attachment: any[];
  },
  chatwoot: any
): Promise<void> => {

  
  const inbox = await chatwoot.findOrCreateInbox({
    name: `${config.INBOX_NAME}`,
  });

  await chatwoot.checkAndSetCustomAttribute();

  const contact = await chatwoot.findOrCreateContact({
    from: getRealJid(dataIn), // Use getRealJid to extract the real JID
    name: dataIn.name,

  });
  
  const conversation = await chatwoot.findOrCreateConversation({
    inbox_id: inbox.id,
    contact_id: contact.id,
    phone_number: dataIn.phone,
  });

  // console.log('[handlerMessage] conversation object:', conversation);
  if (conversation && conversation.id) {
    // console.log('[handlerMessage] conversation.id:', conversation.id);
  }

  if (!conversation || !conversation.id) {
    console.error('[handlerMessage] Error: conversation is null or missing id:', conversation);
    throw new Error('Failed to find or create conversation.');
  }

  await chatwoot.createMessage({
    msg: dataIn.message,
    mode: dataIn.mode,
    conversation_id: conversation.id,
    attachment: dataIn.attachment,
  });
};

export { handlerMessage };

/**
 * Extracts the real JID from the provided data
 * @param dataIn the input data
 */
const getRealJid = (dataIn: any): string => {
  // Example logic to extract the real JID
  // This should be replaced with the actual logic based on your needs
  return dataIn.phone || dataIn.name || '';
};