import { CurrencyService } from "./src/data/currencies/index.ts";

export * from "@models/index.ts";
export * from "@utils/index.ts";

export const initialize = () => {
  CurrencyService.getInstance().initialize();
};
