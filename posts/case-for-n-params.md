---
title: A case for n-params functions
date: 2025-04-17
---

When writing functions in TypeScript (and, truthfully, any language that does not support named parameters), you either pass arguments individually (`n` params) or group them into a single object. While both are valid, I am yet to find a case were object parameters aren't the better choice.

Say you call a function which creates a user:

```ts
const signup = () => {
  createUser("John", "Doe", 28, true);
};
```

At a glance, can you tell what each value means? You’re left guessing: what’s `28`? What’s `true`? The more parameters you add, the more brittle and confusing this becomes.

Instead, consider using an object parameter:

```ts
type TCreateUserInput = {
  firstName: string;
  lastName: string;
  age: number;
  isActive: boolean;
};

const signup = () => {
  createUser({ firstName: "John", lastName: "Doe", age: 28, isActive: true });
};
```

No guessing. No worrying about the order. Your code is self-documenting. Plus, TypeScript gives you full autocompletion and type safety.
