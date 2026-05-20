import { registerFlow } from "../flows/registerFlow";
import { createFlow } from "@builderbot/bot";
import { faqFlow } from "../flows/faqFlow";
import { orderFlow } from "../flows/orderFlow";
import { orderUserCheckerFlow } from "../flows/orderUserCheckerFlow";
import { initialButtonFlow } from "../flows/initialButtonFlow";
import { cateringFlow } from "../flows/cateringFlow";

import { orderFinalFlow } from "../flows/orderFinalFlow";

import { gameFlow } from "../flows/gameFlow";
import { voice_note_flow } from "~/flows/voice_note_flow";
import { blackListFlow } from "~/flows/blacklistFlow";
import { blackListFListlow } from "~/flows/blacklistListFlow";

export default createFlow([
  registerFlow,
  orderFlow,
  orderUserCheckerFlow,
  orderFinalFlow,
  initialButtonFlow,
  gameFlow,
  blackListFlow,
  blackListFListlow,
  cateringFlow,
  faqFlow,

  voice_note_flow

]);
