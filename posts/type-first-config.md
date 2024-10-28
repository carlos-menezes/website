---
title: Type-safe configuration files with TypeScript
description: A simple, type-safe way to handle configuration files in TypeScript
date: 2024-10-27
tags: ["typescript", "javascript"]
---

# Contents

# Introduction

Configuration management is one of those things you are tempted to overlook until it breaks. A missing environment variable in production, a timeout value that worked in development but falls apart under load, or a feature flag that's enabled in the wrong environment. These issues are subtle, hard to catch in testing, and often surface at the worst possible times.

In many projects, I found myself juggling multiple configuration files:

```sh
src
├── config
│   ├── development.json
│   ├── production.json
│   ├── staging.json
```

These files generally followed a similar structure, but were tailored to the specific needs of the project:

```json
// development.json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_dev"
  },
  "cache": {
    "enabled": "false",
    "ttl": "3600"
  }
}

// production.json
{
  "database": {
    "host": "prod-db.example.com",
    "port": "5432",
    "name": "myapp_prod"
  },
  "cache": {
    "enabled": true,
    "ttl": 3600
  }
}
```

What starts as a simple configuration setup inevitably grows more complex as the project naturally evolves. Types drift between environments (if you haven't noticed, the types of `cache.*` are different between the two files), values are inconsistent, and runtime errors become increasingly common.

```ts
const env = process.env.NODE_ENV || "development";
const config = require(`./config/${env}.json`);

// Will always evaluate to `true` because `config.cache.enabled` is a string in `development.json`
const cacheEnabled = config.cache.enabled && true;
```

# Expect the... Expected

Whenever I start a new project these days, my `src` folder always looks the same within the first 5 minutes:

```sh
src
├── config
    ├── configuration
        ├── default.ts
        ├── development.ts
        ├── production.ts
        ├── schema.ts
        ├── index.ts
    ├── environment
        ├── schema.ts
        ├── index.ts
```

## Environment

Take a closer look at the `environment/schema.ts` file. It uses `zod` to describe the expected environment variables for the application.

```ts
export const environmentSchema = z
  .object({
    ENVIRONMENT: z.enum(["development", "production"]),
    DATABASE_URL: z.string(),
    // ...
  })
  .required();

export type EnvironmentSchema = z.infer<typeof environmentSchema>;
```

It is then the duty of the `Environment` class, defined in `environment/index.ts`, to parse the environment variables into the `EnvironmentSchema` type:

```ts
import { environmentSchema, EnvironmentSchema } from "./schema";

class Environment {
  private _environment: EnvironmentSchema;

  constructor() {
    this._environment = this._loadEnvironment();
  }

  get<T extends keyof EnvironmentSchema>(key: T): EnvironmentSchema[T] {
    return this._environment[key];
  }

  private _loadEnvironment(): EnvironmentSchema {
    const parsedSchema = environmentSchema.safeParse(process.env);
    if (!parsedSchema.success) {
      // Handle the error here
    }
    return parsedSchema.data;
  }
}

export const environment = new Environment();
```

In practice, this allows you to get nice autocomplete and type safety when accessing environment variables:

![Environment autocomplete](https://i.imgur.com/Nm9FWwC.png)

## Configuration

The configuration schema is no different from the environment schema (it's also defined using `zod`) but it exports two different types:

```ts
type ConfigurationSchema = z.infer<typeof configurationSchema>;
type RelaxedConfigurationSchema = DeepPartial<ConfigurationSchema>;
```

The `RelaxedConfigurationSchema` type is useful for relaxing configuration requirements, allowing you to override values in the default configuration for a given environment. In practice, this means you define a comprehensive default configuration in the `default.ts` file (with values for every key in the `ConfigurationSchema`) and then override only specific values in the `development.ts` and `production.ts` files. These environment-specific files can omit any keys they don’t need to modify and should export values matching the `RelaxedConfigurationSchema` type.

Assuming the `schema.ts` file exports the following configuration:

```ts
// configuration/default.ts
export const configurationSchema = z.object({
  cache: z.object({
    enabled: z.boolean(),
    ttl: z.number(),
  }),
});

export type ConfigurationSchema = z.infer<typeof configurationSchema>;
export type RelaxedConfigurationSchema = DeepPartial<ConfigurationSchema>;
```

Then, `default.ts` can export a value matching the `ConfigurationSchema` type:

```ts
// configuration/default.ts
export default <ConfigurationSchema>{
  cache: {
    enabled: false,
    ttl: 3600,
  },
};
```

The `development.ts` and `production.ts` files can then override specific values:

```ts
// configuration/development.ts
export default <RelaxedConfigurationSchema>{
  cache: {
    enabled: true,
    // ttl is omitted, so it will use the value from `default.ts`
  },
};
```

The _magic_ of merging the two configurations is handled by the `index.ts` file, and it really is no magic:

```ts
// configuration/index.ts
import merge from "lodash/merge";
import { Environment } from "../environment";
import defaultConfiguration from "./default";
import developmentConfiguration from "./development";
import productionConfiguration from "./production";
import { ConfigurationSchema } from "./schema";

class Configuration {
  // Structure is shared with the Environment class
  // ...
  private _loadConfiguration(): ConfigurationSchema {
    const environment = Environment.get("ENVIRONMENT"); // This is typed!

    if (environment === "development") {
      return merge(defaultConfiguration, developmentConfiguration);
    }

    return merge(defaultConfiguration, productionConfiguration);
  }
}
```

Like the `Environment` class, the `Configuration` can be accessed via the `Configuration.get` method and you will get autocomplete and type safety. The bonus point here is that you're also protected against runtime errors when accessing configuration values.

![Configuration autocomplete](https://i.imgur.com/FUhoFpj.png)

You can then use libraries like `dotenv` to specify whichever environment file to load for your application, i.e.:

```json
// package.json
{
  "scripts": {
    "run:development": "dotenv -e .env.development -- tsx src/index.ts",
    "run:production": "dotenv -e .env.production -- node dist/index.js"
  }
}
```

# Conclusion

If you're anything like me, you'll appreciate the peace of mind that comes with type-safe configuration files. This approach not only catches errors early but also improves the development experience by making configuration management predictable and consistent. In the long run, it’s a small investment that pays off in reliability and confidence across different environments.
