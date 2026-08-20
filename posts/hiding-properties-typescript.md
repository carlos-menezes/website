---
title: Hiding internal state in TypeScript objects
date: 2026-08-20
---

Sometimes an object needs to carry state that consumers should not use directly.

Consider a small logger[^caravan] that stores context internally:

```ts
type Logger = {
  context: Record<string, unknown>;
  info: (message: string) => void;
};
```

The context is part of the implementation, but it is also exposed as part of the logger’s public API. Nothing prevents consumers from reading or changing it.

Prefixing the property with an underscore only communicates intent:

```ts
type Logger = {
  _context: Record<string, unknown>;
  info: (message: string) => void;
};

const logger: Logger = {
  _context: {},
  info: (message) => console.log(message),
};
logger._context = { userId: 123 }; // Nothing stops this
```

An `unique symbol`, however, can make that boundary stronger and the logger can still store the context as a regular object property:


```ts
const CONTEXT_SYMBOL: unique symbol = Symbol("CONTEXT");

type Logger = {
  info: (message: string) => void;
  [CONTEXT_SYMBOL]: Record<string, unknown>;
};

const createLogger = (
  context: Record<string, unknown>,
): Logger => ({
  info: (message) => {
    console.log({ message, context });
  },
  [CONTEXT_SYMBOL]: context,
});
```

Code inside the module can access the property using the symbol:

```ts
export const createChildLogger = (
  parent: Logger,
  context: Record<string, unknown>,
): Logger =>
  createLogger({
    ...parent[CONTEXT_SYMBOL],
    ...context,
  });
```

Code outside the module cannot refer to `CONTEXT_SYMBOL` because it is not exported. The property also stays out of common string-based operations such as `Object.keys` and `JSON.stringify`.

```ts
const logger = createLogger({ requestId: "123" });

Object.keys(logger);
// ["info"]

JSON.stringify(logger);
// {}
```

This is useful when internal state must live on an object but should not become part of its practical public API. The object remains simple, while related functions in the same module retain access to the state.

Symbols, however, do not provide absolute runtime privacy. The property can still be discovered with `Reflect.ownKeys` or `Object.getOwnPropertySymbols` and object spread copies enumerable symbol properties. Still, for library APIs where the goal is to discourage accidental access rather than defend against hostile code, a non-exported unique symbol provides a clean boundary.


[^caravan]: This is ripped out of [@caravan-logger](https://github.com/carlos-menezes/caravan)'s rewrite which is still a work in progress.