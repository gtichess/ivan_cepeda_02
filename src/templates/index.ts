import { createFlow } from "@builderbot/bot";
import { faqFlow } from "../flows/faqFlow";
import { initialButtonFlow } from "../flows/initialButtonFlow";
import { gameFlow } from "../flows/gameFlow";
import { voice_note_flow } from "~/flows/voice_note_flow";
import { blackListFlow } from "~/flows/blacklistFlow";
import { blackListFListlow } from "~/flows/blacklistListFlow";
import { kitFlow } from "~/flows/kitFlow";

export default createFlow([
  initialButtonFlow,
  gameFlow,
  blackListFlow,
  blackListFListlow,
  faqFlow,
  voice_note_flow,
  kitFlow

]);
