import { definePluginConfig } from "@hey-api/openapi-ts";
import { handler } from "./plugin";
import type { RoutesPlugin } from "./types";

export const defaultConfig: RoutesPlugin["Config"] = {
  name: "routes",
  output: "routes",
  config: {},
  dependencies: [],
  handler,
};

export const defineConfig = definePluginConfig(defaultConfig);
