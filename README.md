# heyapi-routes

**Custom plugin for [Hey API](https://heyapi.dev)** that generates type-safe API routes from OpenAPI operations.

## Features

- Generates type-safe route definitions from OpenAPI operations.
- Supports dynamic path parameters like `/posts/{id}`.

## Installation

Install the package via npm:

```
npm install heyapi-routes --save-dev
```

## Usage

In your Hey API config file `openapi.config.ts`:

```
import { defineConfig } from "@hey-api/openapi-ts";
import { defineConfig as routesConfig } from "heyapi-routes";

export default defineConfig({
  input: "openapi.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "api-client",
  },
  plugins: [
    "@hey-api/schemas",
    "@hey-api/sdk",
    "@hey-api/transformers",
    "@hey-api/typescript",
    "@hey-api/client-next",
    routesConfig(),
  ],
});
```
