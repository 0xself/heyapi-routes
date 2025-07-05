import type { DefinePlugin } from "@hey-api/openapi-ts";

export type Config = {
  name: "routes";
  output?: string;
};

export type RoutesPlugin = DefinePlugin<Config>;
