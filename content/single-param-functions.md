---
title: Single parameter functions
date: 2025-04-17
---

When writing functions in TypeScript, you either pass arguments individually (`n` params) or group them into a single object. While both are valid, I am yet to find a case were object parameters aren't the better choice.

Say you call a function which creates a user:

```ts
const signup = () => {
  // ...
  createUser("John", "Doe", 28, true);
  // ...
};
```

At a glance, can you tell what each value means? You’re left guessing: what’s `28`? What’s `true`?

Instead, consider using an object parameter:

```ts
type TCreateUserInput = {
  firstName: string;
  lastName: string;
  age: number;
  isActive: boolean;
};

const signup = () => {
  // ...
  createUser({ firstName: "John", lastName: "Doe", age: 28, isActive: true });
  // ...
};
```

No guessing. No worrying about the order. As your function evolves (i.e. you add new properties to), adding new parameters to an object is low-risk. With positional arguments, it’s a breaking change.

Plus, TypeScript gives you full autocompletion and type safety.
