import { ChatwootClass } from "./services/chatwoot/chatwoot.class";
import { MemoryDB as Database } from "@builderbot/bot";
import { handlerMessage } from "./services/chatwoot";
import downloadFile from "./utils/downloaderUtils";
import { createBot } from "@builderbot/bot";
import ServerHttp from "./services/http";
import templates from "./templates";
import Queue from "queue-promise";
import path from "path";
import fs from "fs";
import { config } from "./config";
import { providerMeta, providerBaileys } from "./provider"
import { get } from "http";
import { getRealJid } from "./utils/whatsapp-utils";

const ASSETS_FOLDER = path.join(process.cwd(), "public/assets");


const chatwoot = new ChatwootClass({
  account: config.CHATWOOT_ACCOUNT_ID,
  token: config.CHATWOOT_TOKEN,
  endpoint: config.CHATWOOT_ENDPOINT,
});

const queue = new Queue({
  concurrent: 1,
  interval: 500,
});

const main = async () => {

  // const adapterFlow = templates;
  let adapterProviderToUse;
  if (config.provider === "meta") {
    adapterProviderToUse = providerMeta;
  } else if (config.provider === "baileys") {
    adapterProviderToUse = providerBaileys;
  } else {
    console.log("ERROR: Falta agregar un provider al .env")
  }


  const bot = await createBot(
    {
      flow: templates,
      provider: adapterProviderToUse,
      database: new Database(),
    },
    {
      queue: {
        timeout: 20000, //👌
        concurrencyLimit: 50, //👌
      },
    }
  );
  const { handleCtx, httpServer } = await bot;
  const provider = adapterProviderToUse;
  new ServerHttp(provider, bot);

  provider.server.get(
    "/v1/health",
    (res: {
      writeHead: (arg0: number, arg1: { "Content-Type": string }) => void;
      end: (arg0: string) => void;
    }) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    }
  );


  // provider.server.post(
  //   "/v1/blacklist",
  //   handleCtx(async (bot, req, res) => {
  //     const { number, intent } = req.body;
  //     // Type assertion para acceder a dynamicBlacklist
  //     const botWithBlacklist = bot as any;

  //     if (intent === "remove") {
  //       botWithBlacklist.dynamicBlacklist.remove(number);
  //       await bot.dispatch("GRACIA_FLOW", { from: number, name: "Cliente" });
  //       return res.end("trigger");
  //     }
  //     if (intent === "add") {
  //       botWithBlacklist.dynamicBlacklist.add(number);
  //     }
  //     res.writeHead(200, { "Content-Type": "application/json" });
  //     return res.end(JSON.stringify({ status: "ok", number, intent }));
  //   })
  // );




 provider.on("message", (payload) => {
    queue.enqueue(async () => {
      try {
        const attachment = [];

        // Verifica si el payload contiene una URL y si el cuerpo incluye "_event_"
        if (payload?.body?.includes("_event_") && payload?.url) {
          const { filePath } = await downloadFile(payload.url, config.jwtToken);
          if (filePath) {
            // Asegúrate de que filePath no sea undefined o null
            attachment.push(filePath);
            console.log("FILE PATH", filePath);
          } else {
            console.log(
              "No se pudo descargar el archivo o la ruta es inválida."
            );
          }
        }

        if (attachment.length > 0 && attachment[0]) {
          const absoluteFilePath = path.resolve(attachment[0]);
          const absoluteAssetsFolder = path.resolve(ASSETS_FOLDER);

          if (!absoluteFilePath.startsWith(absoluteAssetsFolder)) {
            try {
              if (fs.existsSync(absoluteFilePath)) {
                fs.unlinkSync(absoluteFilePath);
                console.log(`Archivo eliminado: ${absoluteFilePath}`);
              } else {
                console.log(`Archivo no encontrado: ${absoluteFilePath}`);
              }
            } catch (err) {
              console.error(
                `Error al eliminar el archivo: ${absoluteFilePath}`,
                err
              );
            }
          }
        }
      } catch (err) {
        console.log("ERROR", err);
      }
    });
  });

  bot.on("send_message", (payload) => {
    queue.enqueue(async () => {
      const attachment = [];
      let absoluteFilePath = null; // Inicializa como null para manejar el caso sin media

      if (payload.options?.media) {
        if (
          typeof payload.options.media === "string" &&
          (payload.options.media.includes("http") ||
            payload.options.media.includes("https"))
        ) {
          const { filePath } = await downloadFile(payload.options.media);
          if (filePath) {
            attachment.push(filePath);
            absoluteFilePath = path.resolve(filePath);
            console.log("FILE PATH", filePath);
          }
        } else if (typeof payload.options.media === "string") {
          attachment.push(payload.options.media);
          absoluteFilePath = path.resolve(payload.options.media); // Si se proporciona un archivo de media local
        }
      }

      const result = getRealJid(payload);
      console.log("Result from getRealJid in App.ts:", result);
      await handlerMessage(
        {
          phone: result, // Use the result from getRealJid instead of payload.from
          name: result, // Use the result from getRealJid instead of payload.from
          message: payload.answer,
          mode: "outgoing",
          attachment: attachment,
        },
        chatwoot
      );

      // Verifica si absoluteFilePath es válido antes de proceder
      if (absoluteFilePath) {
        const absoluteAssetsFolder = path.resolve(ASSETS_FOLDER);

        if (!absoluteFilePath.startsWith(absoluteAssetsFolder)) {
          try {
            if (fs.existsSync(absoluteFilePath)) {
              fs.unlinkSync(absoluteFilePath);
              console.log(`Archivo eliminado: ${absoluteFilePath}`);
            } else {
              console.log(`Archivo no encontrado: ${absoluteFilePath}`);
            }
          } catch (err) {
            console.error(
              `Error al eliminar el archivo: ${absoluteFilePath}`,
              err
            );
          }
        } else {
          console.log(
            `Archivo no eliminado porque está en la carpeta de assets: ${absoluteFilePath}`
          );
        }
      }
    });
  });


  httpServer(+config.PORT);
};

main();

/* OLD APP
import { createBot } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { provider } from "./provider";
import { config } from './config';
import templates from './templates';

const PORT = config.PORT

const main = async () => {
    const { handleCtx, httpServer } = await createBot({
        flow: templates,
        provider: provider,
        database: new Database(),
    })

    httpServer(+PORT)
}

main()

*/
