import { registerFlow } from "../flows/registerFlow";
import { createFlow } from "@builderbot/bot";
import { faqFlow } from "../flows/faqFlow";
import { orderFlow } from "../flows/orderFlow";
import { orderUserCheckerFlow } from "../flows/orderUserCheckerFlow";
import { initialButtonFlow } from "../flows/initialButtonFlow";
import { cateringFlow } from "../flows/cateringFlow";
import { checkPaymentFlow } from "../flows/checkPaymentFlow";
import { orderFinalFlow } from "../flows/orderFinalFlow";
import { guideToShopFlow } from "../flows/guideToShopFlow";
import { commonActionFlow } from "../flows/commonActionFlow";
import { voice_note_flow } from "~/flows/voice_note_flow";
import { blackListFlow } from "~/flows/blacklistFlow";
import { blackListFListlow } from "~/flows/blacklistListFlow";

export default createFlow([
  registerFlow,
  orderFlow,
  orderUserCheckerFlow,
  orderFinalFlow,
  initialButtonFlow,
  commonActionFlow,
  blackListFlow,
  blackListFListlow,
  cateringFlow,
  faqFlow,
  checkPaymentFlow,
  guideToShopFlow,
  voice_note_flow

]);
