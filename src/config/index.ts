import "dotenv/config";

export const config = {
    PORT: process.env.PORT ?? 3008,
    provider: process.env.provider,
    //Meta
    jwtToken: process.env.jwtToken,
    numberId: process.env.numberId,
    verifyToken: process.env.verifyToken,
    version: "v20.0",
    // AI
    Model: process.env.Model,
    ApiKey: process.env.ApiKey,
    //GoogleSheets
    spreadsheetId: process.env.spreadsheetId,
    spreadsheetIdOrder: process.env.spreadsheetIdOrder,
    privateKey: (process.env.privateKey ?? '').split(String.raw`\n`).join('\n'),
    clientEmail: process.env.clientEmail,
    //Chatwoot
    CHATWOOT_ACCOUNT_ID: process.env.AccountID,
    CHATWOOT_TOKEN: process.env.ChatwootToken,
    CHATWOOT_ENDPOINT: process.env.ChatwootEndpoint,
    INBOX_NAME: process.env.INBOX_NAME,
    BOT_URL: process.env.BOT_URL,
    PHONE_NUMBER: process.env.PHONE_NUMBER,
    //Admin Phone
    ADMIN_PHONE: process.env.ADMIN_PHONE
};
