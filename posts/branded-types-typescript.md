---
title: Branded types in TypeScript
date: 2024-05-14
---

Branded types in TypeScript help distinguish values that share the same base type but represent different concepts—like raw strings vs. hashes. They act as compile-time tags to prevent misuse.

Without branded types, it’s easy to confuse values:

```ts
const generateHash = (input: string): string => "hashed_" + input;
const compareHash = (hash: string, input: string): boolean => true;

const userInput = "secretData";
const hash = generateHash(userInput);

// Nothing stops us from mixing the argument order
const matches = compareHash(userInput, hash);
```

Branded types make intent explicit:

```ts
declare const __brand: unique symbol;
type Branded<T, B> = T & { readonly [__brand]: B };
type Hash = Branded<string, "Hash">;

const generateHash = (input: string): Hash => ("hashed_" + input) as Hash;
const compareHash = (hash: Hash, input: string): boolean => true;

const hash = generateHash("secretData");
// Correct usage
const matches = compareHash(hash, "secretData");
```

Now, using a plain string where a hash is expected will result in a compile-time error, turning potential runtime bugs into safe, checked code.
