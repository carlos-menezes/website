import type { ReactNode } from "react";

export default function PostLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <a href="/" className="font-mono">
          [↖]
        </a>
      </div>
      {children}
    </div>
  );
}
