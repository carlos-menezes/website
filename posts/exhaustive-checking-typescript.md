---
title: Forcing TypeScript to be exhaustive
date: 2026-01-15
---

Union types are great until they quietly stop being safe.

TypeScript does not enforce that all members of a union are handled. This usually becomes a problem when a union evolves over time.

```ts
type Notification =
  | { type: "email"; from: string; subject: string }
  | { type: "sms"; from: string; message: string };

const sendNotification = (notification: Notification) => {
  switch (notification.type) {
    case "email":
      // Send email
      break;
    case "sms":
      // Send SMS
      break;
  }
};
```

At this point, the function is exhaustive.

Now the union grows.

```diff
type Notification =
  | { type: "email"; from: string; subject: string }
  | { type: "sms"; from: string; message: string }
+ | { type: "push"; title: string; body: string };
```

The implementation still compiles, even though push notifications are never handled.

```ts
const sendNotification = (notification: Notification) => {
  switch (notification.type) {
    case "email":
      // Send email
      break;
    case "sms":
      // Send SMS
      break;
  }
};
```

`sendNotification` is valid TypeScript, but it is incomplete[^incomplete_typescript].

This happens because nothing in the function asserts that all variants must be handled. The compiler narrows the union inside each case, but it does not verify that the narrowing is exhaustive.

One way to make that explicit is to use `never`[^never].

```ts
const sendNotification = (notification: Notification) => {
  switch (notification.type) {
    case "email":
      // Send email
      break;
    case "sms":
      // Send SMS
      break;
    default: {
      const _exhaustive: never = notification;
      return _exhaustive;
    }
  }
};
```

Inside the default branch, TypeScript narrows notification to everything that was not handled above:
    - If all variants are handled, that remainder is `never`;
    - If a variant is missing, the remainder is that variant.

Assigning `notification` to `never` is therefore a compile-time assertion: there should be no possible value left at this point. When push is added to the union and not handled, this assertion fails. `never` has no values. If the compiler allows the assignment, it has proven that the code path is unreachable.

With this in place, adding a new variant to the union forces every switch over it to be updated.

```ts
const sendNotification = (notification: Notification) => {
  switch (notification.type) {
    case "email":
      // Send email
      break;
    case "sms":
      // Send SMS
      break;
    case "push": // Not adding this case will cause a compile-time error
      // Send push notification
      break;
    default: {
      const _exhaustive: never = notification;
      return _exhaustive;
    }
  }
};
```

[^incomplete_typescript]: Assuming you want to handle all variants explicitly.
[^never]: Read more on the `never` type here: [https://stackoverflow.com/a/54243343](https://stackoverflow.com/a/54243343)
