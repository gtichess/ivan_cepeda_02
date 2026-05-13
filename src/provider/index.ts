import { createProvider } from '@builderbot/bot';
import { MetaProvider } from '@builderbot/provider-meta';
import { BaileysProvider } from "@builderbot/provider-baileys";
import { config } from "../config/index";

const providerMeta = createProvider(MetaProvider, {
  jwtToken: config.jwtToken,
  numberId: config.numberId,
  verifyToken: config.verifyToken,
  version: config.version,
});

const providerBaileys = createProvider(BaileysProvider, {
  version: [2, 3000, 1033927531],
  browser: ["Windows", "Chrome", "Chrome 114.0.5735.198"]
});

export { providerMeta, providerBaileys };

